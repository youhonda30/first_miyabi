import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1),
    })
  ).min(1, '少なくとも1つの商品を選択してください'),
  shippingAddress: z.object({
    name: z.string().min(1),
    postalCode: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),
  }),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { items, shippingAddress } = checkoutSchema.parse(body)

    // Fetch products from database
    const productIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    })

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: '一部の商品が見つかりません' },
        { status: 400 }
      )
    }

    // Check stock availability
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (product && product.stock < item.quantity) {
        return NextResponse.json(
          { error: `${product.name} の在庫が不足しています` },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    let subtotal = 0
    const lineItems: any[] = []

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (product) {
        const itemTotal = Number(product.price) * item.quantity
        subtotal += itemTotal

        lineItems.push({
          price_data: {
            currency: 'jpy',
            product_data: {
              name: product.name,
              description: product.description.substring(0, 200),
              images: product.images,
            },
            unit_amount: Math.round(Number(product.price)),
          },
          quantity: item.quantity,
        })
      }
    }

    const tax = Math.round(subtotal * 0.1) // 10% tax
    const shippingFee = subtotal >= 10000 ? 0 : 500 // Free shipping over ¥10,000
    const total = subtotal + tax + shippingFee

    // Add shipping fee as a line item if applicable
    if (shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'jpy',
          product_data: {
            name: '配送料',
          },
          unit_amount: shippingFee,
        },
        quantity: 1,
      })
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        subtotal,
        tax,
        shippingFee,
        total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        shippingAddress,
        orderItems: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: Number(product.price),
              subtotal: Number(product.price) * item.quantity,
            }
          }),
        },
      },
    })

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
      client_reference_id: order.id,
      customer_email: session.user.email,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
    })

    // Update order with Stripe payment intent ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentIntentId: stripeSession.payment_intent as string,
      },
    })

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url,
      orderId: order.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'チェックアウトセッションの作成に失敗しました' },
      { status: 500 }
    )
  }
}
