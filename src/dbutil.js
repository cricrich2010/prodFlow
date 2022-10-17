const my = require('mysql2');
const myp = require('mysql2/promise');
//const nodemon = require('nodemon');
console.log(process.env.SQL_CNX)
let dbcon_data = { host:"localhost",
                   database:"prodFlow",
                   user:"root",
                   password : process.env.SQL_CNX };

                   
let cnxSql = my.createConnection(dbcon_data);
let cnxSqp = myp.createConnection(dbcon_data);


module.exports.cnxSql = cnxSql;
module.exports.cnxSqp = cnxSqp;
