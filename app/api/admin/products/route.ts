import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ProductCategory } from '@prisma/client'

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  category: z.enum(['PROTEIN', 'SUPPLEMENT', 'GEAR', 'APPAREL', 'ACCESSORY']),
  images: z.array(z.string()),
  tags: z.array(z.string()),
  isActive: z.boolean().default(true),
})

// POST /api/admin/products - Create product
export async function POST(req: Request) {
  const adminCheck = await requireAdmin()
  if (adminCheck instanceof NextResponse) return adminCheck

  try {
    const body = await req.json()
    const data = productSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        ...data,
        category: data.category as ProductCategory,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: '商品の作成に失敗しました' },
      { status: 500 }
    )
  }
}
