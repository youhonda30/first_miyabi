export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          パーソナルトレーニングジムEC
        </h1>
        <p className="text-center text-xl mb-4">
          プロジェクトセットアップが完了しました
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">トレーニングコース</h2>
            <p>パーソナルトレーニングコースを予約・購入できます</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">サプリメント販売</h2>
            <p>プロテインやサプリメントを購入できます</p>
          </div>
        </div>
      </div>
    </main>
  )
}
