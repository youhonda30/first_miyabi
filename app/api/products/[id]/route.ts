import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch product by ID or slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
            orderItems: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: '商品が見つかりません' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    )
    const averageRating =
      product.reviews.length > 0 ? totalRating / product.reviews.length : 0

    // Fetch related products (same category, excluding current product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const productWithDetails = {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: product._count.reviews,
      favoriteCount: product._count.favorites,
      soldCount: product._count.orderItems,
      relatedProducts,
      _count: undefined,
    }

    return NextResponse.json({ product: productWithDetails })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: '商品の取得に失敗しました' },
      { status: 500 }
    )
  }
}
