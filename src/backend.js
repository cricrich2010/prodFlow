const express = require('express');
//const my = require('mysql2');
//const uuid = require('uuid');
const app = express();
const port = 3000;
const Auth = require('./Auth.js');
const FWll = require('./FireWall.js');
console.log('load dbutil')
const cnxSql = require('./dbutil.js');



/*
let dbcon_data = { host:"localhost",
                   database:"prodFlow",
                   user:"root",
                   password :"Test001" };

                   
let cnxSql = my.createConnection(dbcon_data);
*/
let jsonMiddle = express.json()
app.use(express.static('./public'))
app.use(jsonMiddle)
app.use((req, re, next) => {console.log('middleware new req', req.headers.url);next()});
app.use(Auth.user_Auth);
app.use(FWll.firewall);




app.get('/', (req, res) => {
    console.log("receive get: /")
    let data = {
        age: 22,
        name:"Jane"
    }
    res.json(data)
})

app.get('/site/info',(req, res) => {
    console.log("receive get: site/info")
    console.log(req.query.Site)

    cnxSql.cnxSql.query("select * from addresses where Site = ?; ",[req.query.Site],(err, data) => {
        if (err){console.log("err site-info query",err);}
        else{console.log(data);res.json(data)} 
    });
    //res.json(data)
});


app.get('/site/info_lines',(req, res) => {
    console.log("receive get: site/info")
    console.log(req.query.Site)

    cnxSql.cnxSql.query("select * from ProdLignes where Site = ?; ",[req.query.Site],(err, data) => {
        if (err){console.log("err site-info query",err);}
        else{console.log(data);res.json(data)} 
    });
    //res.json(data)
});

app.get('/site/incidents',(req, res) => {
    console.log("receive get: site/incidents")
    console.log(req.query.Site)

    cnxSql.cnxSql.query("select * from Incidents join ProdLignes on Incidents.NoLigne = ProdLignes.NoLigne where Site = ?; ",[req.query.Site],(err, data) => {
        if (err){console.log("err site-incidents query",err);}
        else{
            //console.log(data);
            console.log("data.length", data.length);
            res.header('NbResults', data.length);
            res.json(data);
        } 
    });
    //res.json(data)
    console.log("receive get: site/incidents : out")

});

app.get('/site/info',(req, res) => {
    console.log("receive get: site/info for ", req.query.Site)

    cnxSql.cnxSql.query("select * from ? where Site = ?; ",['Addresses', req.query.Site], (err, data) => {
        if (err){console.log("err site-list query",err);}
        else{console.log(data);res.json(data)} 
    });
    
});

app.get('/site/list',(req, res) => {
    console.log("receive get: site/list")

    cnxSql.cnxSql.query("select * from Sites; ",(err, data) => {
        if (err){console.log("err site-list query",err);}
        else{console.log(data);res.json(data)} 
    });
    
});

app.post('/post-example', (req, res) => {

    res.send("data received")
})


/*
app.get("/login", (req,res) => {
});
*/

app.post('/login', Auth.user_login)
app.post('/new_user', Auth.New_user)
app.post('/new_passwd', Auth.New_passwd)

console.log(process.env.SQL_CNX)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
