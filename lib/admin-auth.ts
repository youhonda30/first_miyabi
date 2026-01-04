import { auth } from './auth'
import { NextResponse } from 'next/server'

/**
 * Verify admin authentication
 * Returns user session if authenticated as admin, otherwise throws error response
 */
export async function requireAdmin() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json(
      { error: 'ログインが必要です' },
      { status: 401 }
    )
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: '管理者権限が必要です' },
      { status: 403 }
    )
  }

  return session
}
