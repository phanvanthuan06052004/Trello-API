/* eslint-disable no-console */
import express from 'express'
// eslint-disable-next-line no-unused-vars
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'

const START_SERVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8017

  app.get('/', async (req, res) => {
  // Test Absolute import mapOrder
    console.log(await GET_DB().listCollections().toArray())
    res.end('<h1>Hello World!</h1><hr>')
  })

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