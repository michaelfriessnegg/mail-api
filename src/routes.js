/* eslint import/no-named-as-default-member: 0 */
import Mailer from 'controllers/Mailer';

//const debug = Debug(`app:routes:${process.pid}`);

export default function(app, router) {
  app.use('/', router);

  // middleware to use for all requests
  router.use((req, res, next) => {
    const { body, headers, id, method, originalUrl, params, query } = req;
    next(); // make sure we go to the next routes and don't stop here
  });

  router
    .route('/mail/send')
    .put((req, res, next) => {
      Mailer.sendMail(req, res, next);
    });

  // Error Handling
  /* eslint-disable no-unused-vars */
  app.use((err, req, res, next) => {
    /* eslint-enable no-unused-vars */
    debug('error middleware, ', { status: err.status, code: err.code, message: err.message });
    if (err.full || err.stack) {
      const stack = (err.full && err.full.stack) || err.stack;
      debug('error stack, ', stack);
    }
    // if code and status is set, we can be sure it is an manually rejected Promise from us!
    if (err.code && err.status) {
      return res.status(err.status).json({
        code: err.code,
        status: err.status,
        message: err.message,
      });
    }
      return res.status(500).json(err);
  });
}
