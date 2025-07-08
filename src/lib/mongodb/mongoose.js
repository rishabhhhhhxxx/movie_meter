import mongoose from 'mongoose'

let initialized = false

export const connect = async () => {
  mongoose.set('strictQuery', true)

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables')
  }

  if (initialized) {
    console.log('MongoDB already connected')
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'moviemeter',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    initialized = true
    console.log('MongoDB connected')
  } catch (error) {
    console.log('MongoDB connection error:', error)
  }
}