import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Filtering
    const trainerId = searchParams.get('trainerId')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minDuration = searchParams.get('minDuration')
    const maxDuration = searchParams.get('maxDuration')
    const search = searchParams.get('search')

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (trainerId) {
      where.trainerId = trainerId
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (minDuration || maxDuration) {
      where.duration = {}
      if (minDuration) where.duration.gte = parseInt(minDuration)
      if (maxDuration) where.duration.lte = parseInt(maxDuration)
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build order by clause
    const orderBy: any = {}
    if (sortBy === 'price') {
      orderBy.price = sortOrder
    } else if (sortBy === 'duration') {
      orderBy.duration = sortOrder
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder
    } else {
      orderBy.createdAt = sortOrder
    }

    // Fetch courses
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          trainer: {
            select: {
              id: true,
              name: true,
              bio: true,
              specialties: true,
              image: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              bookings: true,
              favorites: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }),
      prisma.course.count({ where }),
    ])

    // Calculate average rating for each course
    const coursesWithRatings = courses.map((course) => {
      const totalRating = course.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      )
      const averageRating =
        course.reviews.length > 0 ? totalRating / course.reviews.length : 0

      return {
        ...course,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: course._count.reviews,
        bookingCount: course._count.bookings,
        favoriteCount: course._count.favorites,
        reviews: undefined,
        _count: undefined,
      }
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      courses: coursesWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error('Courses fetch error:', error)
    return NextResponse.json(
      { error: 'コースの取得に失敗しました' },
      { status: 500 }
    )
  }
}
