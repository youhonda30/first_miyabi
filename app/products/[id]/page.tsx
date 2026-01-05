'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Minus, Plus } from 'lucide-react'

type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  reviews?: Array<{
    id: string
    rating: number
    comment: string
    userName: string
    createdAt: string
  }>
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        setProduct(data.product)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [resolvedParams.id])

  const handleAddToCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?.id,
          quantity,
        }),
      })

      if (res.ok) {
        router.push('/cart')
      } else {
        const data = await res.json()
        alert(data.error || 'カートへの追加に失敗しました')
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('カートへの追加に失敗しました')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price)
  }

  const calculateAverageRating = () => {
    if (!product?.reviews || product.reviews.length === 0) return 0
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / product.reviews.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square bg-muted animate-pulse rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded"></div>
            <div className="h-6 bg-muted animate-pulse rounded w-1/2"></div>
            <div className="h-24 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">商品が見つかりません</h1>
        <Button onClick={() => router.push('/products')}>
          商品一覧に戻る
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="aspect-square bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">画像なし</span>
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.reviews && product.reviews.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-yellow-500">★</span>
                <span>{calculateAverageRating()}</span>
                <span>({product.reviews.length}件のレビュー)</span>
              </div>
            )}
          </div>

          <div>
            <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">商品説明</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">在庫状況</h3>
            {product.stock > 0 ? (
              <Badge variant="outline" className="text-green-600">
                在庫あり ({product.stock}点)
              </Badge>
            ) : (
              <Badge variant="destructive">在庫切れ</Badge>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div>
              <h3 className="font-semibold mb-2">数量</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  合計: {formatPrice(product.price * quantity)}
                </span>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock > 0 ? 'カートに追加' : '在庫切れ'}
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">カスタマーレビュー</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                        >
                          ★
                        </span>
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
    </div>
  )
}
