import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { z } from "zod"

const resetPasswordSchema = z.object({
  token: z.string().min(1, "トークンが必要です"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上である必要があります")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "パスワードは大文字、小文字、数字を含む必要があります"
    ),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = resetPasswordSchema.parse(body)

    // Find valid token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: "無効なトークンです" },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      })
      return NextResponse.json(
        { error: "トークンの有効期限が切れています" },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: verificationToken.identifier,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      )
    }

    // Hash new password
    const hashedPassword = await hash(password, 12)

    // Update user password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    })

    // Delete used token
    await prisma.verificationToken.delete({
      where: { token },
    })

    return NextResponse.json({
      message: "パスワードが正常にリセットされました",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 }
    )
  }
}
