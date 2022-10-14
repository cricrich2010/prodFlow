
const RestrictedUrl= [
    '/restrected*',
    '/restrected2',
    '/restrected3',
    '/new_passwd',
    '/site/incidents'

]


function firewall(req, res, next){
    console.log('firewall: in', 'req.url:', req.url)
    if(  RestrictedUrl.includes(req.url) && ! req.authenticated){
        console.log('firewall: in')

        res.status(403);
        res.send("")
    }else{
        console.log('firewall: next')

        next()}
};

module.exports.firewall = firewall