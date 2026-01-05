'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, Users, Star } from 'lucide-react'

type Trainer = {
  id: string
  name: string
  bio: string
  specialties: string[]
  image: string | null
}

type Review = {
  id: string
  rating: number
  comment: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
  createdAt: string
}

type Booking = {
  id: string
  scheduledAt: string
  status: string
}

type RelatedCourse = {
  id: string
  name: string
  price: number
  duration: number
  images: string[]
  trainer: {
    id: string
    name: string
  } | null
}

type Course = {
  id: string
  name: string
  description: string
  price: number
  duration: number
  capacity: number
  images: string[]
  trainer: Trainer | null
  reviews: Review[]
  bookings: Booking[]
  averageRating: number
  reviewCount: number
  availableSlots: number
  relatedCourses: RelatedCourse[]
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${resolvedParams.id}`)
        if (!res.ok) throw new Error('Course not found')
        const data = await res.json()
        setCourse(data.course)
      } catch (error) {
        console.error('Failed to fetch course:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [resolvedParams.id])

  const handleBooking = async () => {
    // TODO: Implement booking modal or redirect to booking page
    router.push(`/bookings/new?courseId=${course?.id}`)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0 && mins > 0) {
      return `${hours}時間${mins}分`
    } else if (hours > 0) {
      return `${hours}時間`
    } else {
      return `${mins}分`
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-video bg-muted animate-pulse rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded"></div>
            <div className="h-6 bg-muted animate-pulse rounded w-1/2"></div>
            <div className="h-24 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">コースが見つかりません</h1>
        <Button onClick={() => router.push('/courses')}>
          コース一覧に戻る
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Course Images */}
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-lg border">
            {course.images && course.images.length > 0 ? (
              <Image
                src={course.images[selectedImage]}
                alt={course.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">画像なし</span>
              </div>
            )}
          </div>
          {course.images && course.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {course.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-video overflow-hidden rounded-md border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${course.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Course Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
            {course.averageRating > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="text-yellow-500">★</span>
                <span>{course.averageRating}</span>
                <span>({course.reviewCount}件のレビュー)</span>
              </div>
            )}
          </div>

          {/* Trainer Info */}
          {course.trainer && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {course.trainer.image ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={course.trainer.image}
                        alt={course.trainer.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xl">{course.trainer.name[0]}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{course.trainer.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.trainer.bio}
                    </p>
                    {course.trainer.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {course.trainer.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <p className="text-3xl font-bold">{formatPrice(Number(course.price))}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">コース説明</h3>
            <p className="text-muted-foreground">{course.description}</p>
          </div>

          {/* Course Details */}
          <div className="space-y-3">
            <h3 className="font-semibold">詳細情報</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span>所要時間: {formatDuration(course.duration)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5" />
              <span>定員: {course.capacity}名</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              {course.availableSlots > 0 ? (
                <Badge variant="outline" className="text-green-600">
                  空き枠: {course.availableSlots}名
                </Badge>
              ) : (
                <Badge variant="destructive">満員</Badge>
              )}
            </div>
          </div>

          {/* Booking Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleBooking}
            disabled={course.availableSlots === 0}
          >
            <Calendar className="mr-2 h-5 w-5" />
            {course.availableSlots > 0 ? '予約する' : '満員'}
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      {course.reviews && course.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">受講者レビュー</h2>
          <div className="space-y-4">
            {course.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {review.user.image ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={review.user.image}
                            alt={review.user.name || 'User'}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm">
                            {review.user.name?.[0] || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">
                          {review.user.name || '匿名ユーザー'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Related Courses */}
      {course.relatedCourses && course.relatedCourses.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">同じトレーナーの他のコース</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {course.relatedCourses.map((relatedCourse) => (
              <Card
                key={relatedCourse.id}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
                <a href={`/courses/${relatedCourse.id}`}>
                  {relatedCourse.images && relatedCourse.images.length > 0 ? (
                    <div className="relative aspect-video">
                      <Image
                        src={relatedCourse.images[0]}
                        alt={relatedCourse.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">画像なし</span>
                    </div>
                  )}
                </a>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {relatedCourse.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">
                      {formatPrice(Number(relatedCourse.price))}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {formatDuration(relatedCourse.duration)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
