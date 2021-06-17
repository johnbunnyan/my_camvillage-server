const express = require("express");
// const https = require('https');
// const fs = require('fs');
const cors = require('cors');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const itemRouter = require('./routes/item');
const controller = require('./controllers/others');


require("./models");
const sequelize = require('./models').sequelize;
const app = express();

sequelize.sync();
const port = 4000;

//라우팅 뒤에 있었는데 앞으로 끌고 왔습니다
//express 미들웨어가 라우팅보다 와야 라우팅에서 적용됨
app.use(express.json()); //req.body 접근하게 해주는 미들웨어
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET, POST, OPTIONS, PUT'],
  credentials: true
}));
app.use('/uploads', express.static('uploads'))
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/item', itemRouter);
app.get('/main', controller.mainpageController);
app.post('/search', controller.searchController);


module.exports = app.listen(port, () => {
  console.log(`🚀 Server is starting on ${port}`);
});


// http 프로토콜 대신 https 프로토콜을 사용 시 사용
// let server;

// if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
//   server = https
//     .createServer(
//       {
//         key: fs.readFileSync(__dirname + `/` + 'key.pem', 'utf-8'),
//         cert: fs.readFileSync(__dirname + `/` + 'cert.pem', 'utf-8'),
//       },
//       app
//     )
//     .listen(4000);
// } else {
//   server = app.listen(4000)
// }
// console.log(`server listening on ${port}`)

// module.exports = server;