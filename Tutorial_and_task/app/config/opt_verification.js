// const express = require('express');
// const responseTime = require('response-time')
// const axios = require('axios');
// const Redis = require('ioredis');

// const app = express();
// // const port = 3000;


// const redis = new Redis( {
//   retryStrategy: null
// });

// redis.on('end', () => {
//   log.warn('shutting down service due to lost Redis connection');

//   lightship.shutdown();
// });
// app.use(responseTime());

// async function getrepo(req,res,next){
//   try{

//     const searchTerm = req.query.page;
//     redis.get(searchTerm, async (err, response) => {
//       if (err) throw err;

//       if (response) {
//           res.status(200).send({
//             response: JSON.parse(response),
//             message: "data retrieved from the cache"
//         });
//       }

//     // console.log('fetching data..');
    
//     else{
//     const response = await axios.get(`https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${searchTerm}`);
//     //  redis.setex(`wikipedia:${searchTerm}`, 600,  JSON.stringify(response.data));
//     redis.set("otp","otp");
//     redis.expire("otp",300);
//      res.status(200).send({
//       response: response.data,
//       message: "cache miss"
//   });
//     // redis.set("otp","otp")
//     // res.send(responseJSON);
//     }
//   });
//   }
//   catch(err){
//     console.error(err);
//     res.status(500);
//   }
// }
// app.get('/api/:query', getrepo);

// app.listen(3000, () => {
//   console.log('Server listening on port: ', 3000);
// });