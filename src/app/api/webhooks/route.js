import { verifyWebhook } from '@clerk/nextjs/webhooks'

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req)

    const { id } = evt.data
    const eventType = evt.type

    if (eventType === 'user.created') {
      console.log('User created:', id)
    } else if (eventType === 'user.updated') {
      console.log('User updated:', id)
    } else if (eventType === 'user.deleted') {
      console.log('User deleted:', id)
    } else {
      console.log('Unhandled event type:', eventType)
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
