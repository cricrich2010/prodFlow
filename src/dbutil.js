const my = require('mysql2');
//const nodemon = require('nodemon');
console.log(process.env.SQL_CNX)
let dbcon_data = { host:"localhost",
                   database:"prodFlow",
                   user:"root",
                   password : process.env.SQL_CNX };

                   
//let cnxSql = my.createConnection(dbcon_data);
let cnxSql = ""
module.exports.cnxSql = cnxSql;
