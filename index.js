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

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/item', itemRouter);
app.get('/main', controller.mainpageController);
app.get('/search', controller.searchController);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'https://localhost:3000',
  methods: ['GET, POST, OPTIONS'],
  credentials: true
}));

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