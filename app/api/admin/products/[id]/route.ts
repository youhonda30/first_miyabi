import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ProductCategory } from '@prisma/client'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  category: z.enum(['PROTEIN', 'SUPPLEMENT', 'GEAR', 'APPAREL', 'ACCESSORY']).optional(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

// PUT - Update product
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin()
  if (adminCheck instanceof NextResponse) return adminCheck

  try {
    const { id } = await params
    const body = await req.json()
    const data = updateSchema.parse(body)

    const product = await prisma.product.update({
      where: { id },
      data: data.category ? { ...data, category: data.category as ProductCategory } : data,
    })

    return NextResponse.json({ product })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 })
  }
}

// DELETE - Delete product
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await requireAdmin()
  if (adminCheck instanceof NextResponse) return adminCheck

  try {
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ message: '削除しました' })
  } catch (error) {
    return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 })
  }
}
