import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/dashboard - ダッシュボード統計取得
export async function GET() {
  const adminCheck = await requireAdmin()
  if (adminCheck instanceof NextResponse) return adminCheck

  try {
    // Get date for 30 days ago
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Parallel queries for dashboard data
    const [
      totalRevenue,
      totalOrders,
      recentOrders,
      lowStockProducts,
      customerCount,
      revenueThisMonth,
      ordersThisMonth,
    ] = await Promise.all([
      // Total revenue (all time)
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          status: {
            not: 'CANCELLED',
          },
        },
      }),

      // Total orders (all time)
      prisma.order.count({
        where: {
          status: {
            not: 'CANCELLED',
          },
        },
      }),

      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
      }),

      // Low stock products (stock <= 10)
      prisma.product.findMany({
        where: {
          stock: {
            lte: 10,
          },
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          stock: true,
          price: true,
          images: true,
          category: true,
        },
        orderBy: {
          stock: 'asc',
        },
        take: 10,
      }),

      // Customer count
      prisma.user.count({
        where: {
          role: {
            in: ['CUSTOMER', 'TRAINER'],
          },
        },
      }),

      // Revenue this month
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          status: {
            not: 'CANCELLED',
          },
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),

      // Orders this month
      prisma.order.count({
        where: {
          status: {
            not: 'CANCELLED',
          },
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
    ])

    return NextResponse.json({
      stats: {
        totalRevenue: Number(totalRevenue._sum.total || 0),
        totalOrders,
        revenueThisMonth: Number(revenueThisMonth._sum.total || 0),
        ordersThisMonth,
        customerCount,
      },
      recentOrders,
      lowStockProducts,
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    return NextResponse.json(
      { error: 'ダッシュボード統計の取得に失敗しました' },
      { status: 500 }
    )
  }
}
