// const allowedCors = [
//   'https://api.nomoreparties.co/beatfilm-movies',
//   'http://localhost:3000',
//   'http://localhost:3002',
//   'https://angelDiplomnaya.nomoredomains.club',
//   'https://api.angelDiplomnaya.nomoredomains.club',
// ];

// module.exports.cors = (req, res, next) => {
//   const { origin } = req.headers;
//   const { method } = req;
//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
//   const requestHeaders = req.headers['access-control-request-headers'];

//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', 'no-cors');
//   }

//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     return res.end();
//   }

//   return next();
// };
