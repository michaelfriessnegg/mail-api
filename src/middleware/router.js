export default function(router) {
  router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type,X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
  });
}
