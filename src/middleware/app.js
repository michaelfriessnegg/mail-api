import Debug from 'debug';
import bodyParser from 'body-parser';
import compression from 'compression';
import enforce from 'express-sslify';
import errorHandler from 'errorhandler';
import { schema } from 'config';

const debug = Debug(`app:utils:app:${process.pid}`);

export default function(app) {
  if (schema === 'https') {
    debug('enforce https!');
    // enforce HTTPS connection
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }

  // allow json and urlencoded body input
  // TODO: set correct request limit
  app.use(bodyParser.json({ limit: '30mb' }));
  app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

  app.use(compression());

  // eslint-disable-next-line no-undef
  if (app.get('dev')) {
    debug('use errorHandler');
    app.use(errorHandler());
  }
}
