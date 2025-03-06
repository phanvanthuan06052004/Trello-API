
import { MongoClient, ServerApiVersion} from 'mongodb'
import { env } from './environment'

let trelloDatabaseInstance = null

const MongoClientInstance = new MongoClient(env.MONGODB_URI, {
// dùng để kiểm tra phiên bản có hợp lệ và đồng bộ không (ko dùng vẫn ok)
// https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/#connection-guide
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  // lời gọi kết nối tới  MongoDB atlas với URI khai báo ở trên
  await MongoClientInstance.connect()
  // Lấy database gán cho trelloDatabaseInstance
  trelloDatabaseInstance = MongoClientInstance.db(env.DATABASE_NAME)
}

// Lưu ý: khi gọi hàm này nhớ kết nối DB trước (hàm này tái sử dụng cho nhiều nơi)
export const GET_DB = () => {
  if ( !trelloDatabaseInstance ) throw new Error('Must connect to database first')
  return trelloDatabaseInstance
}

//close DB
export const CLOSE_DB = async () => {
  await MongoClientInstance.close()
}