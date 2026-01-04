'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, Menu } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">FitGear</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            ホーム
          </Link>
          <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
            商品
          </Link>
          <Link href="/courses" className="text-sm font-medium transition-colors hover:text-primary">
            コース
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
        </nav>

        {/* Right側のアクション */}
        <div className="flex items-center space-x-4">
          {/* カートアイコン */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">カート</span>
            </Button>
          </Link>

          {/* ユーザーメニュー */}
          {session ? (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/account">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">アカウント</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                ログアウト
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={() => signIn()} className="hidden md:inline-flex">
              ログイン
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">メニュー</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-4">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              ホーム
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              商品
            </Link>
            <Link
              href="/courses"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              コース
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            {session ? (
              <>
                <Link
                  href="/account"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  アカウント
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()} className="w-full">
                  ログアウト
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => signIn()} className="w-full">
                ログイン
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
