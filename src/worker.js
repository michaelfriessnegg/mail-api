import App from 'middleware/app';
import Debug from 'debug';
import Morgan from 'middleware/morgan';
import Router from 'middleware/router';
import Routes from 'routes';
import config from 'config';
import express from 'express';
import fs from 'fs';
import {resolveRefs} from 'json-refs';
import swaggerTools from 'swagger-tools';
import yaml from 'js-yaml';

const debug = Debug(`app:${process.pid}`);

export function run(worker) {
  // create an express app, per service worker (cpu)
  const app = express();
  // instantiate an express Router
  const router = express.Router();

  // eslint-disable-next-line no-console
  console.log('   >> Worker PID:', process.pid);

  // grab the http connection from the service worker
  const httpServer = worker.httpServer;
  // and channel every request - that comes in - to the express app
  httpServer.on('request', app);

  const dev = true;
  const port = 3000;
  let host = config.host || 'localhost';
  host = host === 'localhost' ? `localhost:${port}` : host;

  // set the express config variables
  app.set('dev', dev);
  app.set('env', 'development');
  app.set('port', port);

  // instantiate the middlewares
  Morgan(app);
  Router(router);
  App(app);

  // swaggerRouter configuration
  const options = {
    swaggerUi: '/swagger',
    swaggerUiDir: './public',
    controllers: './controllers',
  };

  // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
  const spec = fs.readFileSync('./swagger.yaml', 'utf8');
  let swaggerConfig = yaml.load(spec);
  const refOptions = {
    loaderOptions: {
      filter: ['relative', 'remote'],
      processContent(res, callback) {
        // convert the yaml to an json
        const json = yaml.load(res.text);
        // call the callback without the error parameter
        callback(null, json);
      },
    },
  };
  // source: http://azimi.me/2015/07/16/split-swagger-into-smaller-files.html
  // docs for splitting up yaml:
  // https://github.com/whitlockjc/path-loader/blob/master/docs/API.md#pathloaderloadlocation-options--promise
  resolveRefs(swaggerConfig, refOptions)
    .then(results => {
      swaggerConfig = results.resolved;
      // overwrite the swagger config depending on the environment we are in
      swaggerConfig.host = host;
      const newArray = [];
      newArray.push(config.schema);
      swaggerConfig.schemes = newArray.length ? newArray : swaggerConfig.schemes;

      // Initialize the Swagger middleware
      swaggerTools.initializeMiddleware(swaggerConfig, middleware => {
        // Interpret Swagger resources and attach metadata to request
        // must be first in swagger-tools middleware chain
        app.use(middleware.swaggerMetadata());

        // Validate Swagger requests
        app.use(
          middleware.swaggerValidator({
            validateResponse: false,
          })
        );

        // Route validated requests to appropriate controller
        // app.use(middleware.swaggerRouter(options));

        // Serve the Swagger documents and Swagger UI
        app.use(middleware.swaggerUi(options));

        Routes(app, router);

        const scServer = worker.scServer;
      });
    })
    .catch(err => {
      debug('Error loading the Swagger files:');
      debug(err);
    });
}

export default {
  run,
};
