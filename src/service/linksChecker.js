const LinkService = require('../service/link.service')
class CheckerLinks {
    static async linkTest(url, param = [], fullInfo = []) {
        let urls;
        let status;
        let links = [];

        await fetch(url, {
            redirect: 'manual'
        }).then(async (res) => {

           urls = res.url; 
           status = res.status;
           if (res.status !== 200 && res.headers.get('location') !== null) {
           param.push({ urls, status }); 
             
                return CheckerLinks.linkTest(res.headers.get('location'), param,fullInfo);

            } else {
                param.push({ urls, status }); 
                links = [] 
                links.push(res.url)
                let data = await LinkService.test(links);
                console.log(data, 'data');
                data[0].redirected_chains.push(param);

                fullInfo.push(data);

                return fullInfo
            }
        }).catch(async (err) => {
            console.log(err);
            if(err.message === "Cannot read properties of undefined (reading 'push')" || err.message === "Cannot read properties of undefined (reading 'code')"){
                return fullInfo.push({
                    url,
                    status: "There is the problem with this link"
                })
            }
            else if (err.cause.code === 'ECONNRESET' || String(err.cause) === "Error: certificate has expired") {
                return fullInfo.push({
                    url,
                    status: 503
                 })
                }
            else if(err.cause.code === 'ENOTFOUND' ){
                    return fullInfo.push({
                        url,
                        status: 404
                     })
                }     
            else if(err.cause.code === 'UND_ERR_CONNECT_TIMEOUT' ){
                        return fullInfo.push({
                            url,
                            status: 408
                      })
                }
            else{
            return fullInfo.push({
                url,
                status:"We don't have access for information"
            })
            }
        });
        const info = fullInfo.flat(3)
        return info
    }
}


module.exports = CheckerLinks
