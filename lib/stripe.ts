import Stripe from 'stripe'

// For build time, use placeholder (will fail at runtime if actually used without proper key)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_placeholder_for_build'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

// Runtime validation - will throw when Stripe is actually called
if (!process.env.STRIPE_SECRET_KEY && typeof window === 'undefined') {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe functionality will not work.')
}
