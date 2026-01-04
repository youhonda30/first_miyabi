import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data (in development only)
  await prisma.favorite.deleteMany()
  await prisma.review.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.course.deleteMany()
  await prisma.trainer.deleteMany()
  await prisma.product.deleteMany()

  console.log('Cleared existing data')

  // Create Trainers
  const trainer1 = await prisma.trainer.create({
    data: {
      name: '山田 太郎',
      bio: '10年以上の経験を持つパーソナルトレーナー。ボディビル大会での優勝経験あり。',
      specialties: ['筋力トレーニング', 'ダイエット', 'ボディメイク'],
      image: '/trainers/yamada.jpg',
    },
  })

  const trainer2 = await prisma.trainer.create({
    data: {
      name: '佐藤 花子',
      bio: 'ヨガインストラクター資格保持。女性のボディメイクを専門としています。',
      specialties: ['ヨガ', 'ピラティス', '女性向けトレーニング'],
      image: '/trainers/sato.jpg',
    },
  })

  console.log('Created trainers')

  // Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'ホエイプロテイン チョコレート味',
        slug: 'whey-protein-chocolate',
        description: '高品質なホエイプロテイン。チョコレート風味で飲みやすく、筋肉の成長をサポートします。',
        price: 4980,
        stock: 100,
        category: 'PROTEIN',
        images: ['/products/protein-chocolate.jpg'],
        tags: ['プロテイン', 'チョコ', '初心者向け'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'ホエイプロテイン バニラ味',
        slug: 'whey-protein-vanilla',
        description: '高品質なホエイプロテイン。バニラ風味でさっぱりとした味わい。',
        price: 4980,
        stock: 80,
        category: 'PROTEIN',
        images: ['/products/protein-vanilla.jpg'],
        tags: ['プロテイン', 'バニラ'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'BCAA サプリメント',
        slug: 'bcaa-supplement',
        description: '筋肉の分解を防ぎ、トレーニング効果を最大化するBCAAサプリメント。',
        price: 2980,
        stock: 150,
        category: 'SUPPLEMENT',
        images: ['/products/bcaa.jpg'],
        tags: ['BCAA', 'サプリ', '筋トレ'],
      },
    }),
    prisma.product.create({
      data: {
        name: 'トレーニンググローブ',
        slug: 'training-gloves',
        description: '手のひらを保護し、グリップ力を向上させるトレーニンググローブ。',
        price: 1980,
        stock: 50,
        category: 'GEAR',
        images: ['/products/gloves.jpg'],
        tags: ['グローブ', 'ギア', '保護'],
      },
    }),
    prisma.product.create({
        name: 'トレーニングウェア 上下セット',
        slug: 'training-wear-set',
        description: '吸汗速乾素材のトレーニングウェア。動きやすさを重視したデザイン。',
        price: 6980,
        stock: 30,
        category: 'APPAREL',
        images: ['/products/wear-set.jpg'],
        tags: ['ウェア', 'セット', '速乾'],
      },
    }),
  ])

  console.log(`Created ${products.length} products`)

  // Create Courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        name: 'パーソナルトレーニング 60分',
        slug: 'personal-training-60min',
        description: 'マンツーマンでのパーソナルトレーニング。あなたの目標に合わせたメニューを提供します。',
        price: 8000,
        duration: 60,
        capacity: 1,
        trainerId: trainer1.id,
        images: ['/courses/personal-60.jpg'],
      },
    }),
    prisma.course.create({
      data: {
        name: 'パーソナルトレーニング 90分',
        slug: 'personal-training-90min',
        description: 'じっくり取り組める90分のパーソナルトレーニング。',
        price: 12000,
        duration: 90,
        capacity: 1,
        trainerId: trainer1.id,
        images: ['/courses/personal-90.jpg'],
      },
    }),
    prisma.course.create({
      data: {
        name: 'グループヨガレッスン',
        slug: 'group-yoga',
        description: '少人数制のヨガレッスン。初心者から上級者まで参加可能。',
        price: 3000,
        duration: 60,
        capacity: 10,
        trainerId: trainer2.id,
        images: ['/courses/yoga-group.jpg'],
      },
    }),
  ])

  console.log(`Created ${courses.length} courses`)

  // Create Test User
  const passwordHash = await hash('password123', 12)
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'テストユーザー',
      phone: '090-1234-5678',
      password: passwordHash,
      role: 'CUSTOMER',
    },
  })

  console.log('Created test user')

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: '管理者',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('Created admin user')

  // Create Cart for test user
  const cart = await prisma.cart.create({
    data: {
      userId: testUser.id,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
          },
          {
            productId: products[2].id,
            quantity: 1,
          },
        ],
      },
    },
  })

  console.log('Created cart with items')

  // Create Sample Order
  const order = await prisma.order.create({
    data: {
      userId: testUser.id,
      subtotal: 12940,
      tax: 1294,
      shippingFee: 500,
      total: 14734,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      shippingAddress: {
        name: 'テストユーザー',
        postalCode: '123-4567',
        address: '東京都渋谷区1-2-3',
        phone: '090-1234-5678',
      },
      orderItems: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            price: 4980,
            subtotal: 9960,
          },
          {
            productId: products[2].id,
            quantity: 1,
            price: 2980,
            subtotal: 2980,
          },
        ],
      },
    },
  })

  console.log('Created sample order')

  // Create Reviews
  await prisma.review.createMany({
    data: [
      {
        userId: testUser.id,
        productId: products[0].id,
        rating: 5,
        comment: 'とても美味しくて飲みやすいです！筋肉もついてきました。',
      },
      {
        userId: testUser.id,
        courseId: courses[0].id,
        rating: 5,
        comment: '丁寧な指導でとても分かりやすかったです。また利用します！',
      },
    ],
  })

  console.log('Created reviews')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
