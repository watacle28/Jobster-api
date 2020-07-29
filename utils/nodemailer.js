const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const emailTemplate = user => `
  <div className="email" style="
    border: 1px solid #e24727;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hope you are having a great day</h2>
    <p>${user.bio}</p>
    <p> have attached a resume, for your consideration. Please take a moment to go through it to get a better idea of who I am.</p>

    <p>I would love to talk to you in more detail regarding this amazing opportunity at your company. I look forward to hearing back from you regarding my application.</p>
    <p>Please use this email to contact me <a href="#">${user.email}</a></p>
    <p>Best,</p>
    <p>${user.fullname}</p>
  </div>
`;

module.exports = {
  emailTemplate,
  transport
};