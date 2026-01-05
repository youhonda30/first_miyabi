'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  const categories = [
    { value: 'ALL', label: 'すべて' },
    { value: 'PROTEIN', label: 'プロテイン' },
    { value: 'SUPPLEMENT', label: 'サプリメント' },
    { value: 'GEAR', label: 'トレーニングギア' },
    { value: 'APPAREL', label: 'アパレル' },
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory === 'ALL'
          ? '/api/products'
          : `/api/products?category=${selectedCategory}`
        const res = await fetch(url)
        const data = await res.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">商品一覧</h1>
        <p className="text-muted-foreground">
          高品質なサプリメントとトレーニングギアをご用意しています
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="aspect-square bg-muted rounded-md"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <Link href={`/products/${product.id}`}>
                <CardHeader className="p-0">
                  {product.images && product.images.length > 0 ? (
                    <div className="relative aspect-square">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">画像なし</span>
                    </div>
                  )}
                </CardHeader>
              </Link>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.stock < 10 && product.stock > 0 && (
                    <Badge variant="outline" className="text-orange-600">
                      残り{product.stock}点
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge variant="destructive">在庫切れ</Badge>
                  )}
                </div>
                <Link href={`/products/${product.id}`}>
                  <CardTitle className="text-lg mb-2 hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                </Link>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
                <Link href={`/products/${product.id}`}>
                  <Button size="sm" disabled={product.stock === 0}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock > 0 ? '詳細を見る' : '在庫切れ'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">商品が見つかりませんでした</p>
        </div>
      )}
    </div>
  )
}
