const brevo = require('@getbrevo/brevo')
import { env } from '~/config/environment'

let apiInstance = new brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, customHtmlContent) => {
  // Khởi tạo thông tin email
  let sendSmtpEmail = new brevo.SendSmtpEmail()

  // Tài khoản gửi email: lưu ý phải trùng với account trên brevo
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME
  }

  // Những tài khoản nhận email
  // to phải là array đẻ sau này có thể gửi nhiều người
  sendSmtpEmail.to = [{ email: recipientEmail }]

  // Tiêu đề email
  sendSmtpEmail.subject = customSubject

  // Nội dung email
  sendSmtpEmail.htmlContent = customHtmlContent

  // gọi hành động gửi email
  // sendTransacEmail của thư viện nó sẽ return về 1 promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)

}

export const BrevoProvider = {
  sendEmail
}