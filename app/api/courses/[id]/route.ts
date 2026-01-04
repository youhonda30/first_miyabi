import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch course by ID or slug
    const course = await prisma.course.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        trainer: true,
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
        bookings: {
          where: {
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
          select: {
            id: true,
            scheduledAt: true,
            status: true,
          },
          orderBy: {
            scheduledAt: 'asc',
          },
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
            favorites: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'コースが見つかりません' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const totalRating = course.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    )
    const averageRating =
      course.reviews.length > 0 ? totalRating / course.reviews.length : 0

    // Calculate available slots
    const totalBookings = course.bookings.length
    const availableSlots = course.capacity - totalBookings

    // Fetch related courses (same trainer, excluding current course)
    const relatedCourses = await prisma.course.findMany({
      where: {
        trainerId: course.trainerId,
        id: { not: course.id },
        isActive: true,
      },
      take: 4,
      include: {
        trainer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const courseWithDetails = {
      ...course,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: course._count.reviews,
      totalBookings: course._count.bookings,
      favoriteCount: course._count.favorites,
      availableSlots,
      relatedCourses,
      _count: undefined,
    }

    return NextResponse.json({ course: courseWithDetails })
  } catch (error) {
    console.error('Course fetch error:', error)
    return NextResponse.json(
      { error: 'コースの取得に失敗しました' },
      { status: 500 }
    )
  }
}
