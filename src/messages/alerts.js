const sgMail = require('@sendgrid/mail')
const config = require('config')

sgMail.setApiKey(config.get('SENDGRID_API_KEY'))

const sendWelcomeMessage = (email, name) => {
    sgMail.send({
        to: email,
        from: 'devdafe@gmail.com',
        subject: `Welcome ${name.toUpperCase()}!`,
        text: `Thank you for chosing Stop2Shop as your goto online shop for your latest clothing and accessories. Let us know how you get along with this app! `
    })

}
const sendLoginMessage = (email, name) => {
    sgMail.send({
        to: email,
        from: 'devdafe@gmail.com',
        subject: `Welcome back ${name.toUpperCase()}!`,
        text: `Thank you logging in via ${email}, to your Stop2Shop account; your goto online shop for your latest clothing and accessories. Let us know if you are not responsible for this login action via email support@stop2shop.com`
    })

}

module.exports = {
    sendWelcomeMessage,
    sendLoginMessage
}