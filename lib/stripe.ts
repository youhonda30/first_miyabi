import Stripe from 'stripe'

// For build time, allow empty string (will fail at runtime if actually used)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})
