export default class LogToConsoleEmailSender {
  sendEmail({
    from,
    to,
    subject,
    body,
  }: {
    from: string
    to: string
    subject: string
    body: string
  }): void {
    console.log('Sending email')
    console.log('- From: ', from)
    console.log('- To: ', to)
    console.log('- Subject: ', subject)
    console.log('- Body: ', body)
    console.log('Email sent')
  }
}
