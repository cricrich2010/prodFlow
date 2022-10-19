const Buffer = require('safe-buffer').Buffer;
const Crypto = require('crypto');
const uuid = require('uuid');
const cnxSql = require('./dbutil.js');
const seed = "Password hash seed";
// const Auth   = exports;

let validToken ={}

//req.authenticated

function user_Auth(req, res, next) {
  //has the request an AuthToken
  if(!req.get('AuthToken')){
    req.headers['authenticated'] = false;
    // req.set('authenticated', false)
    return next();}
  //is token a valid token
  if (req.get('AuthToken') in validToken.keys()){
    if(validToken['AuthToken'][1] > Date()){
      req.req.headers['authenticated'] = true;
      // req.set('authenticated', true);
      return next();
    }else{
      delete validToken['AuthToken']
      req.req.headers['authenticated'] = false;
      // req.set('authenticated', false)
      return next();}
  }else{
    req.req.headers['authenticated'] = false;
    // req.set('authenticated', false)
    return next();}
};

  
// // Method to check the entered password is correct or not 
// UserSchema.methods.validPassword = function(password) { 
//   let hash = Crypto.pbkdf2Sync(password, this.seed, 1000, 64, `sha512`).toString(`hex`); 
//   return this.hash === hash; 
// }; 
// check user concistency request
function user_consistency (req, res){
      //check query fields
      console.log(req.body)
      console.log(typeof(req.body))
      console.log(req.body['FirstName'])
      console.log(req.body['Auth'])
      console.log(req.body['Firstame'])
      console.log(req.body['bidon'])

     
      if (!(req.body['FirstName'] && req.body['Auth'])){
        console.log("fields miss")
        res.status(403).send('Authentication failled: missing login and/or password');
        return false;}
      // check empty iser
      if (req.body['FirstName'] == ""){
        console.log("empty login")
        res.status(403).send('Authentication failled: missing login and/or password');
        return false;}
        console.log("user req consistent")

        return true
}

function GeneRetToken(req, res){
  // generate and return token
  let UserUuid = uuid.uuidv1().toString('hex')
  // add token to valid list
  let Nowdate = Date()
  Nowdate += (2*60*1000) // add 2 mins
  validToken.append([hash], [req.body['FirstName'], Nowdate] )
  res.status(200).json({'AuthToken':UserUuid});
}

function cleanup_ValidToken(){
  // need timer to remove expred token
}


async function user_Login(req, res){
  //check query fields
  if (!user_consistency(req, res)){return;}

  //check user exist and pw is valid (db has no empty userlogin empty)
  cnxSql.cnxSql.query('select Auth, FirstName from People where FirstName = ?', [req.body['FirstName']], (err, UserAuth) => {
  if (err) {
    console.log(err)
    res.status(500).send()
  }else{

    console.log(UserAuth)
    console.log(UserAuth[0])
    console.log('UserAuth[0].Auth', UserAuth[0].Auth)

    // user dosn't exist
    if (UserAuth.length == 0){
      res.status(403).send('Authentication failled: missing login and/or password');
      return;}
    // empty key is always valid -->> this is a student project !!!!
    console.log('UserAuth[0].Auth', UserAuth[0].Auth)
    if (UserAuth[0].Auth=== "" || UserAuth[0].Auth === null){
      // generate and return token
      let UserUuid = uuid.uuidv1().toString('hex')
      res.status(200).json({'AuthToken':UserUuid});
      return;}
    // check password
    let hash = Crypto.pbkdf2Sync(req.body['Auth'], seed, 1000, 64, `sha512`).toString(`hex`); 
    if (UserAuth[0].Auth === hash){
      // password ok, generate and return token
      let UserUuid = uuid.uuidv1().toString('hex')
      res.status(200).json({'AuthToken':UserUuid});
      return;}
    else {
      res.status(403).send('Authentication failled: wrong login and/or password');
      return;}}})
    }

async function New_User(req, res){
  //check query fields
  if (!user_consistency(req, res)){return;}

  //check user exist and pw is valid (db has no empty userlogin empty)
  let UserAuth = await cnxSql.cnxSqp.query('select Auth form People where Firstname = ?', [req.body['FirstName']])
  console.log(UserAuth)
  // user dosn't exist
  if (UserAuth.length = 1){
  res.status(403).send('user creation failled: user already exist');
  return;}

  //create user
  let hash = Crypto.pbkdf2Sync(req.body['Auth'], this.seed, 1000, 64, `sha512`).toString(`hex`); 
  UserAuth = await cnxSql.cnxSqp.query('insert INTO People (FirstName, Auth) values (?,?)', [req.body['FirstName'], hash])

  // generate and return token
  let UserUuid = uuid.uuidv1().toString('hex')
  // add token to valid list
  let Nowdate = Date()
  Nowdate += (2*60*1000) // add 2 mins
  validToken.append([hash], [req.body['FirstName'], Nowdate] )
  res.status(200).json({'AuthToken':UserUuid});
  return;
  
} 


async function New_Passwd(req, res){
  //check query fields
  if (!user_consistency(req, res)){return;}
  let hash = "";
  // hash pass if any
  if (!req.body['Auth']=== ""){ hash = Crypto.pbkdf2Sync(req.body['Auth'], this.seed, 1000, 64, `sha512`).toString(`hex`); }
  // rec new passwd
  let UserAuth = await cnxSql.cnxSql.query('UPDATE People SET Auth = ? where FirstName = ?;', [req.body['FirstName'], hash])

  
} 

module.exports.user_Auth = user_Auth;
module.exports.user_Login = user_Login;
module.exports.New_User = New_User;
module.exports.New_Passwd = New_Passwd;

