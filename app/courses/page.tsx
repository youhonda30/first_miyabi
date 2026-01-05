'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users } from 'lucide-react'

type Trainer = {
  id: string
  name: string
  bio: string
  specialties: string[]
  image: string | null
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
  averageRating: number
  reviewCount: number
  bookingCount: number
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrainer, setSelectedTrainer] = useState<string>('ALL')
  const [trainers, setTrainers] = useState<Trainer[]>([])

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await fetch('/api/trainers')
        const data = await res.json()
        setTrainers(data.trainers || [])
      } catch (error) {
        console.error('Failed to fetch trainers:', error)
      }
    }

    fetchTrainers()
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = selectedTrainer === 'ALL'
          ? '/api/courses'
          : `/api/courses?trainerId=${selectedTrainer}`
        const res = await fetch(url)
        const data = await res.json()
        setCourses(data.courses || [])
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [selectedTrainer])

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">コース一覧</h1>
        <p className="text-muted-foreground">
          経験豊富なトレーナーによる多彩なトレーニングコース
        </p>
      </div>

      {/* Trainer Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button
          variant={selectedTrainer === 'ALL' ? 'default' : 'outline'}
          onClick={() => setSelectedTrainer('ALL')}
        >
          すべてのトレーナー
        </Button>
        {trainers.map((trainer) => (
          <Button
            key={trainer.id}
            variant={selectedTrainer === trainer.id ? 'default' : 'outline'}
            onClick={() => setSelectedTrainer(trainer.id)}
          >
            {trainer.name}
          </Button>
        ))}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-md"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <Link href={`/courses/${course.id}`}>
                <CardHeader className="p-0">
                  {course.images && course.images.length > 0 ? (
                    <div className="relative aspect-video">
                      <Image
                        src={course.images[0]}
                        alt={course.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">画像なし</span>
                    </div>
                  )}
                </CardHeader>
              </Link>
              <CardContent className="p-4">
                <div className="mb-3">
                  {course.trainer && (
                    <div className="flex items-center gap-2 mb-2">
                      {course.trainer.image ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={course.trainer.image}
                            alt={course.trainer.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs">{course.trainer.name[0]}</span>
                        </div>
                      )}
                      <span className="text-sm font-medium">{course.trainer.name}</span>
                    </div>
                  )}
                  <Link href={`/courses/${course.id}`}>
                    <CardTitle className="text-lg mb-2 hover:text-primary transition-colors">
                      {course.name}
                    </CardTitle>
                  </Link>
                  <CardDescription className="line-clamp-2 mb-3">
                    {course.description}
                  </CardDescription>
                </div>

                {/* Course Meta */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(course.duration)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    定員{course.capacity}名
                  </Badge>
                </div>

                {/* Rating */}
                {course.averageRating > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-yellow-500">★</span>
                    <span>{course.averageRating}</span>
                    <span>({course.reviewCount}件)</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <p className="text-2xl font-bold">{formatPrice(Number(course.price))}</p>
                <Link href={`/courses/${course.id}`}>
                  <Button size="sm">詳細を見る</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">コースが見つかりませんでした</p>
        </div>
      )}
    </div>
  )
}
