import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateQuantitySchema = z.object({
  quantity: z.number().int().min(0),
})

// PUT /api/cart/:id - 数量更新
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const { quantity } = updateQuantitySchema.parse(body)

    // Find cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
        product: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'カートアイテムが見つかりません' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'アクセス権限がありません' },
        { status: 403 }
      )
    }

    // If quantity is 0, delete the item
    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { id },
      })

      return NextResponse.json({
        message: 'カートから削除しました',
      })
    }

    // Check stock
    if (cartItem.product.stock < quantity) {
      return NextResponse.json(
        { error: '在庫が不足しています' },
        { status: 400 }
      )
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    })

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                stock: true,
                images: true,
                category: true,
                isActive: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      message: '数量を更新しました',
      cart: updatedCart,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Update cart item error:', error)
    return NextResponse.json(
      { error: '数量の更新に失敗しました' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart/:id - アイテム削除
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Find cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'カートアイテムが見つかりません' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'アクセス権限がありません' },
        { status: 403 }
      )
    }

    // Delete item
    await prisma.cartItem.delete({
      where: { id },
    })

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                stock: true,
                images: true,
                category: true,
                isActive: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      message: 'カートから削除しました',
      cart: updatedCart,
    })
  } catch (error) {
    console.error('Delete cart item error:', error)
    return NextResponse.json(
      { error: 'カートからの削除に失敗しました' },
      { status: 500 }
    )
  }
}
