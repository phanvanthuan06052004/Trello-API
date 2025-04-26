/* eslint-disable no-console */
import express from 'express'
// eslint-disable-next-line no-unused-vars
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cors from 'cors'
import { env } from '~/config/environment'
import { corsOptions } from './config/cors'
import cookieParser from 'cookie-parser'
const START_SERVER = () => {
  const app = express()

  const hostname = env.APP_HOST
  const port = env.APP_PORT

  // Fix Cache from disk của ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Cấu hình cookieParser
  app.use(cookieParser())

  app.use(cors(corsOptions))
  // Enabel req body data
  app.use(express.json())

  app.use('/v1', APIs_V1)


  // Middleware xử lí lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
    console.log(`Hello Thuan, I am running at ${ hostname }:${ port }/`)
  })

  // Clean connect
  exitHook(() => { // BẮT SỰ KIÊN CTR C
    CLOSE_DB()
  })
}

// Cách 2 start server: Immediately-invoked / Anonymous Async Functions (IIFE)
// ( async () => {
//   try {
//     console.log('connecting to DB')
//     await CONNECT_DB()
//     console.log('connect succesfull')
//     START_SERVER()
//   } catch (error) {
//     console.log(error)
//     process.exit(0)
//   }
// })()

// // Chỉ khi kết nối vs DB thành công thì mới khởi động app (kiến  trúc thác nước)
CONNECT_DB()
  .then( () => console.log('connect succesfull to MongoDB'))
  .then( () => START_SERVER())
  .catch(error => {
    console.log(error)
    process.exit(0)// có lỗi thì out chương trình
  })