const express = require('express');
//const my = require('mysql2');
//const uuid = require('uuid');
const app = express();
const port = 3010;
const Auth = require('./Auth.js');
const FWll = require('./FireWall.js');
console.log('load dbutil')
const {cnxSql, cnxSqp, mypool} = require('./dbutil.js');

//console log the querie sreceived by the server
function queryInLog(req, res, next){
    console.log('middleware new req::', 'url:',req.url, 'body:', req.body)
    ;next()
}

//middlewares
app.use(express.static('./public'));
app.use(express.json());
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
    cnxSql.query("select * from Sites; ",(err, data) => {
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
    cnxSql.query("select * from addresses where Site = ?; ",[req.query.Site], (err, data) => {
        if (err){
            console.log("err site-list query",err);
            res.status(500);
            res.send(err)}
        else{console.log(data);
            res.json(data)} 
    });
});

app.get('/site/info_lignes',(req, res) => {
     //return lines info of site
    console.log("receive get: site/info", req.query.Site)
    cnxSql.query("select * from ProdLignes where Site = ?; ",[req.query.Site],(err, data) => {
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
    cnxSql.query("select * from Incidents join ProdLignes on Incidents.NoLigne = ProdLignes.NoLigne where Site = ?; ",[req.query.Site],(err, data) => {
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
app.post('/new_line', New_Prod_Line)

console.log(process.env.SQL_CNX)

function prodLine_consistency (req, res){
    //check query fields
    if (!('Site' in req.body && 'NoLigne' in req.body && 'Volume'in req.body )){
      res.status(400).statusMessage('inconsistent fields request received').end();
      return false;}
    // check empty iser

    console.log(typeof(req.body['Site']), req.body['Site'])
    console.log(typeof(req.body['NoLigne']),req.body['NoLigne'])
    console.log(typeof(req.body['Volume']),req.body['Volume'])


    if (req.body['Site'] == "" || req.body['NoLigne'] == "" || ! typeof(req.body['Volume']) === "number" ){
      res.status(400).statusMessage('inconsistent data request received').end();
      return false;}
      return true
}

// using promise and return query result
queryProm = (qString, qParam) => {return new Promise ((resolve, reject)=>{
    //console.log(qString)
    cnxSql.query(
        qString,
        qParam,
        (error, data, fields)=>{
            if(error){
                console.log(error)
                return reject(error);
            }else{
            return resolve({data, fields});}
        }
    );
});};

async function New_Prod_Line(req, res){
    //check query fieldss
    if (!prodLine_consistency(req, res)){return;}
    //check line exist 

    let {data: resLine, fields: fieldsLine} = await queryProm('select count(NoLigne) as resLine from ProdLignes where Site = ? and NoLigne = ?',
     [req.body['Site'], req.body['NoLigne']])
     
    console.log('resline type : ', typeof(resLine))
    console.log("check line exist", resLine)
    console.log("check type resLine[0].resLine  : ", typeof(resLine[0].resLine))
    console.log("check line exist resLine[0].resLine  : ", resLine[0].resLine)
    console.log(resLine[0].resLine === 0)

    // Line doesn't exist
    if ( ! (resLine[0].resLine === 0)){
    res.status(400).statusMessage = 'Line creation aborded: Line already exist'
    res.end();
    return;}
  
    //create New Line
    let createdLine = await queryProm('insert INTO ProdLignes (Site, NoLigne, Volume) values (?,?,?)',
                     [req.body['Site'], req.body['NoLigne'], req.body['Volume']])
    console.log("New line created",createdLine)
    res.status(200).statusMessage = 'enjoy your new prod line'
    res.end();
    return;
  } 





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
