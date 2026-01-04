import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Dumbbell, ShoppingBag, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-muted py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              あなたの理想のボディを
              <span className="block text-primary">実現する</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              プロフェッショナルなトレーニングと厳選されたサプリメントで、
              あなたのフィットネスジャーニーをサポートします
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/courses">
                <Button size="lg" className="w-full sm:w-auto">
                  コースを見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  商品を見る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">FitGearの特徴</h2>
            <p className="text-muted-foreground">プロフェッショナルなサポートで理想の体づくり</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Dumbbell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">プロのトレーナー</h3>
              <p className="text-muted-foreground">
                経験豊富なトレーナーがあなたの目標達成をサポートします
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">厳選商品</h3>
              <p className="text-muted-foreground">
                プロテインやサプリメントなど、高品質な商品のみを厳選
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">パーソナライズ</h3>
              <p className="text-muted-foreground">
                一人ひとりの目標に合わせたカスタマイズプランを提供
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">今すぐ始めよう</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            あなたのフィットネスジャーニーを今日から始めましょう
          </p>
          <Link href="/courses">
            <Button size="lg">
              無料体験を予約
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
