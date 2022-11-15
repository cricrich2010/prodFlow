
const AllowedUrl= [
    '/',
    '/login',
    '/new_user',
    '/site/list',
    '/site/info',
    '/site/info_lignes',
    '/site/incidentsFake',
    '/new_passwdFake',
    '/new_line'
] // revert the logic to specify free route only
//think about rout access by role


function firewall(req, res, next){
    console.log('firewall: in', 'req.url:', req.url, 'user is auth: ', req.authenticated)
    //console.log(req)
    let qurl = req.url
    if (!(req.url.indexOf('?') === -1)){qurl = req.url.substr(0,req.url.indexOf('?')).toLowerCase()}
    console.log("computed url:", qurl)

let fake= 1/0

    if( AllowedUrl.includes(qurl) ){
        //allowed url -> you pass
        console.log('firewall: allowed url')
        next()
    }else if (req.authenticated){
        //you are authenticated -> you pass
        console.log('firewall: authenticated user')
        next()
    }else{
        // access is denied
        console.log('firewall: url access denied')
        res.status(403);
        res.statusMessage= "You are not allowed to access to this content"
        res.end()
}
};

module.exports.firewall = firewall;

