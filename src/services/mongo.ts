import mongoose from 'mongoose'
import { config } from '../config/config'

export const connectToDb = () => new Promise((resolve, reject) => {
  mongoose.connect(config.mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: config.mongo.dbName
  })

  const db = mongoose.connection

  db.on('error', () => {
    console.error.bind(console, 'connection error:')
    reject('mongodb connection error')
  })

  db.once('open', () => {
    console.log("mongodb connected")
    resolve("mongodb connected")
  })
})