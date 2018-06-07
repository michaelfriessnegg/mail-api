import nodemailer from 'nodemailer';

const smtpConfig = {
  host: 'localhost',
  port: 25,
};

const transporter = nodemailer.createTransport(smtpConfig);
const sendMailPromise = mailOptions => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, err => {
      if (err) reject(err);
      resolve();
    });
  });
};

export async function send(opts) {
  const mailOptions = {
    from: `HTL Kaindorf <${'test@htlkaindorf.at'}>`, // sender address
    to: opts.to || [], // list of receivers
    subject: opts.subject, // Subject line
    text: opts.text, // plaintext body
    html: opts.html, // html body
    attachments: opts.attachments || [], // email attachments
  };
  try {
    return sendMailPromise(mailOptions);
  } catch (err) {
    console.error(`Mail to ${mailOptions.to} was not sent correctly.`);
    console.error(err);
    // TODO: do not reject the Promise, instead create a logging Entry, that the Mail couldn't be sent!
    throw err;
  }
}

export default {
  send,
};
