import { send } from 'utils/mailer';

export async function sendMail(req, res, next) {
  const message = req.swagger.params.message.value;
  const receiver = req.swagger.params.receiver.value;
  const subject = req.swagger.params.subject.value;
  try {
    await send({
      from: 'mytestMail@test.at',
      to: receiver,
      subject,
      text: message,
    });
    return res.json('Email successfully sent!');
  } catch (ex) {
    return next({
      status: 500,
      code: 181004,
      message: ex.message,
    });
  }
}

export default {
  sendMail,
};

