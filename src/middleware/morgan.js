/**
 * Request Logging  with Morgan
 */

import { host } from 'config';
import morgan from 'morgan';
import uuid from 'node-uuid';

morgan.token('id', req => req.id);

export default function(app) {
  app.use((req, res, next) => {
    req.id = uuid.v4();
    next();
  });

  // eslint-disable-next-line no-undef
  if (app.get('dev')) {
    app.use(morgan('dev'));
  } else {
    // app.use(morgan(':id :method :url :status :response-time ms - :res[content-length]'));
  }
}
