import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 会社情報 */}
          <div>
            <h3 className="text-lg font-bold mb-4">FitGear</h3>
            <p className="text-sm text-muted-foreground">
              パーソナルトレーニングジム向けのプレミアムサプリメント＆トレーニングギア
            </p>
          </div>

          {/* ショップ */}
          <div>
            <h3 className="text-sm font-semibold mb-4">ショップ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=PROTEIN" className="text-muted-foreground hover:text-primary">
                  プロテイン
                </Link>
              </li>
              <li>
                <Link href="/products?category=SUPPLEMENT" className="text-muted-foreground hover:text-primary">
                  サプリメント
                </Link>
              </li>
              <li>
                <Link href="/products?category=GEAR" className="text-muted-foreground hover:text-primary">
                  トレーニングギア
                </Link>
              </li>
              <li>
                <Link href="/products?category=APPAREL" className="text-muted-foreground hover:text-primary">
                  アパレル
                </Link>
              </li>
            </ul>
          </div>

          {/* サポート */}
          <div>
            <h3 className="text-sm font-semibold mb-4">サポート</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary">
                  配送について
                </Link>
              </li>
            </ul>
          </div>

          {/* 法的情報 */}
          <div>
            <h3 className="text-sm font-semibold mb-4">法的情報</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/law" className="text-muted-foreground hover:text-primary">
                  特定商取引法
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FitGear. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
