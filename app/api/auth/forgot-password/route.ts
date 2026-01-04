import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Return success even if user doesn't exist (security best practice)
    if (!user) {
      return NextResponse.json({
        message:
          "パスワードリセットのメールを送信しました。メールをご確認ください。",
      })
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Store token in database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: resetToken,
        expires: resetTokenExpiry,
      },
    })

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    // await sendPasswordResetEmail(email, resetUrl)

    console.log(`Password reset requested for: ${email}`)
    console.log(`Reset token: ${resetToken}`)

    return NextResponse.json({
      message:
        "パスワードリセットのメールを送信しました。メールをご確認ください。",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 }
    )
  }
}
