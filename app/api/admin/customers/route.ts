import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/customers - 顧客一覧取得
export async function GET(req: Request) {
  const adminCheck = await requireAdmin()
  if (adminCheck instanceof NextResponse) return adminCheck

  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: {
            in: ['CUSTOMER', 'TRAINER'],
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
          orders: {
            select: {
              total: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.user.count({
        where: {
          role: {
            in: ['CUSTOMER', 'TRAINER'],
          },
        },
      }),
    ])

    // Calculate total purchase amount for each customer
    const customersWithStats = customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      role: customer.role,
      createdAt: customer.createdAt,
      orderCount: customer._count.orders,
      totalPurchaseAmount: customer.orders.reduce(
        (sum, order) => sum + Number(order.total),
        0
      ),
    }))

    return NextResponse.json({
      customers: customersWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get customers error:', error)
    return NextResponse.json(
      { error: '顧客一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}
