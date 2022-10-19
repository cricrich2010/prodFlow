const express = require('express');
//const my = require('mysql2');
//const uuid = require('uuid');
const app = express();
const port = 3010;
const Auth = require('./Auth.js');
const FWll = require('./FireWall.js');
console.log('load dbutil')
const cnxSql = require('./dbutil.js');


function queryInLog(req, res, next){
    console.log('middleware new req', req.headers.url)
    ;next()
}

//middlewares
let jsonMiddle = express.json()
app.use(express.static('./public'));
app.use(jsonMiddle);
app.use(queryInLog);
app.use(Auth.user_Auth);
app.use(FWll.firewall);

//routes : Get
app.get('/', (req, res) => {
    console.log("receive get: /")
    let data = {
        age: 22,
        name:"Jane"
    }
    res.json(data)
})

app.get('/site/list',(req, res) => {
    //returne liste of sites
    console.log("receive get: site/list")
    cnxSql.cnxSql.query("select * from Sites; ",(err, data) => {
        if (err){
            console.log("err site-list query",err);
            res.status(500);
            res.send(err)}
        else{console.log(data);
            res.json(data)} 
    });
});

app.get('/site/info',(req, res) => {
    //return detail info of site
    console.log("receive get: site/info for ", req.query.Site)
    cnxSql.cnxSql.query("select * from addresses where Site = ?; ",[req.query.Site], (err, data) => {
        if (err){
            console.log("err site-list query",err);
            res.status(500);
            res.send(err)}
        else{console.log(data);
            res.json(data)} 
    });
});

app.get('/site/info_lines',(req, res) => {
     //return lines info of site
    console.log("receive get: site/info", req.query.Site)
    cnxSql.cnxSql.query("select * from ProdLignes where Site = ?; ",[req.query.Site],(err, data) => {
        if (err){
            console.log("err site-info query",err);
            res.status(500);
            res.send(err)}
        else{console.log(data);
            res.json(data)} 
    });
});

app.get('/site/incidents',(req, res) => {
     //return incident of site
    console.log("receive get: site/incidents", req.query.Site)
    cnxSql.cnxSql.query("select * from Incidents join ProdLignes on Incidents.NoLigne = ProdLignes.NoLigne where Site = ?; ",[req.query.Site],(err, data) => {
        if (err){console.log("err site-incidents query",err);
            res.status(500);
            res.send(err)}
        else{
            //console.log(data);
            console.log("data.length", data.length);
            res.header('NbResults', data.length);
            res.json(data);} 
    });
    console.log("receive get: site/incidents : out")
});

//route post
app.post('/post-example', (req, res) => {
    res.send("data received")
})

app.post('/login', Auth.user_Login)
app.post('/new_user', Auth.New_User)
app.post('/new_passwd', Auth.New_Passwd)

app.post('/New_Line', New_Prod_Line)

console.log(process.env.SQL_CNX)

function prodLine_consistency (req, res){
    //check query fields
    if (!(req.body.get('FirstName') && req.body.get('Auth') && req.body.get('Volume'))){
      res.status(503).send('inconsistent request received');
      return false;}
    // check empty iser
    if (req.body.get('Site') == "" || req.body.get('NoLine') == "" || req.body.get('Volume') == "" ){
      res.status(503).send('inconsistent request received');
      return false;}
      return true
}


async function New_Prod_Line(req, res){
    //check query fields
    if (!prodLine_consistency(req, res)){return;}
  
    //check user exist and pw is valid (db has no empty userlogin empty)
    let UserAuth = await cnxSql.cnxSql.query('select Auth form People where Firstname = ?', [req.body.get('FirstName')])
    console.log(UserAuth)
    // user dosn't exist
    if (UserAuth.length = 1){
    res.status(403).send('user creation failled: user already exist');
    return;}
  
    //create user
    let hash = crypto.pbkdf2Sync(req.body.get('Auth'), this.seed, 1000, 64, `sha512`).toString(`hex`); 
    UserAuth = await cnxSql.cnxSql.query('insert INTO People (FirstName, Auth) values (?,?)', [req.body.get('FirstName'), hash])
  
    // generate and return token
    let UserUuid = uuid.uuidv1().toString('hex')
    // add token to valid list
    let Nowdate = Date()
    Nowdate += (2*60*1000) // add 2 mins
    validToken.append([hash], [req.body.get('FirstName'), Nowdate] )
    res.status(200).json({'AuthToken':UserUuid});
    return;
    
  } 





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
