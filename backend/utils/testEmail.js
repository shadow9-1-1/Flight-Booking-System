require('dotenv').config();
const { MailtrapClient } = require('mailtrap');

const TOKEN = process.env.MAILTRAP_TOKEN;

const client = new MailtrapClient({ token: TOKEN });

const sender = {
  email: 'hello@demomailtrap.co',
  name: 'Mailtrap Test',
};

const recipients = [
  {
    email: 'ahmedwael2612004@gmail.com',
  },
];

client
  .send({
    from: sender,
    to: recipients,
    subject: 'You are awesome!',
    text: 'Congrats for sending test email with Mailtrap!',
    category: 'Integration Test',
  })
  .then((response) => {
    console.log('✅ Email sent successfully:', response);
  })
  .catch((error) => {
    console.error('❌ Email sending failed:', error.message);
  });
