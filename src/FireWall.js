
const RestrictedUrl= [
    '/restrected*',
    '/restrected2',
    '/restrected3',
    '/new_passwd',
    '/site/incidents',
    '/NEw_Fake',
    '/New_passwd',
    '/New_Line'
] // revert the logic to specify free route only
//think about rout access by role


function firewall(req, res, next){
    console.log('firewall: in', 'req.url:', req.url)
    if(  RestrictedUrl.includes(req.url) && ! req.authenticated){
        console.log('firewall: in')
        res.status(403);
        res.send("You are not allowed to access to this content")
    }else{
        console.log('firewall: next')
        next()}
};

module.exports.firewall = firewall;

