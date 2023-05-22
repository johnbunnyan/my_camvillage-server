require('dotenv').config(); // this is important!
module.exports = {
  "development": {
    "username": "root",
    "password": process.env.DEV_PASSWORD,
    "database": "camvillage",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql"
  },
  "test": {
    "username": "admin",
    "password": process.env.TEST_PASSWORD,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
