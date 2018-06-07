import {SocketCluster} from 'socketcluster';
import scHotReboot from 'sc-hot-reboot';

// API Doc: http://socketcluster.io/#!/docs/api-socketcluster
const socketCluster = new SocketCluster({
  // change this to scale vertically
  workers: 1,
  brokers: 1,
  port: 3000,
  appName: 'fishtank-controller',

  // Switch wsEngine to 'uws' for a MAJOR performance boost (beta)
  wsEngine: 'ws',

  /* A JS file which you can use to configure each of your
   * workers/servers - This is where most of your backend code should go
   */
  workerController: `${__dirname}/worker.js`,

  /* JS file which you can use to configure each of your
   * brokers - Useful for scaling horizontally across multiple machines (optional)
   */
  brokerController: `${__dirname}/broker.js`,

  // Crash workers when an error happens (defaults to true)
  crashWorkerOnError: true,

  // Reboot workers when they crash - This is a necessity
  // in production but can be turned off for debugging (defaults to true)
  rebootWorkerOnCrash: true,

  // If using nodemon, set this to true, and make sure that environment is 'dev'.
  killMasterOnSignal: false,

  // trigger an immediate shutdown of workers. In 'prod' workers will
  // be terminated progressively in accordance with processTermTimeout.
  environment: 'dev',
});

// This will cause SC workers to reboot when code changes anywhere in the app directory.
// The second options argument here is passed directly to chokidar.
// See https://github.com/paulmillr/chokidar#api for details.
console.log(`   !! The sc-hot-reboot plugin is watching for code changes in the ${__dirname} directory`);
scHotReboot.attach(socketCluster, {
  cwd: __dirname,
  ignored: ['index.js', 'broker.js'],
});
