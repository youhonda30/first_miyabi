import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/customers/:id - 顧客詳細と購入履歴取得
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin()
  if (adminCheck instanceof NextResponse) return adminCheck

  try {
    const { id } = await params

    const customer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        orders: {
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    images: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!customer) {
      return NextResponse.json(
        { error: '顧客が見つかりません' },
        { status: 404 }
      )
    }

    // Calculate statistics
    const totalPurchaseAmount = customer.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    )
    const orderCount = customer.orders.length

    return NextResponse.json({
      customer: {
        ...customer,
        stats: {
          orderCount,
          totalPurchaseAmount,
        },
      },
    })
  } catch (error) {
    console.error('Get customer error:', error)
    return NextResponse.json(
      { error: '顧客詳細の取得に失敗しました' },
      { status: 500 }
    )
  }
}
