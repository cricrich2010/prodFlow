const my = require('mysql2');
const myp = require('mysql2/promise');
//const nodemon = require('nodemon');
console.log(process.env.SQL_CNX)
let dbcon_data = { host:"localhost",
                   database:"prodFlow",
                   user:"root",
                   password : process.env.SQL_CNX };




                   
let cnxSql = my.createConnection(dbcon_data);
let cnxSqp = new myp.PromiseConnection(dbcon_data);

// console.log(cnxSql)
// console.log('cnxSqlcnxSqlcnxSqlcnxSqlcnxSqlcnxSql') ,
// console.log(cnxSqp)
// console.log('objcet myp',Object.keys(myp))
// console.log('object cnxSqp',Object.keys(cnxSqp))


const pool = myp.createPool({connectionLimit: 10, ...dbcon_data}); 

module.exports.mypool = pool;
module.exports.cnxSql = cnxSql;
module.exports.cnxSqp = cnxSqp;
