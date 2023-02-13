// class RedirectedLinks {
//     static async linksTest(url, settings) {
//         global.links = [];
//         return await RedirectedLinks.test(url, settings);
//     }
//     static async test(url, settings) {
//         try {
//             await fetch(url, settings).then((res) => {
// // 
//                 if (res.headers.get('Location') !== url && (res.status === 301 || res.status === 302)) {
//                     links.push({
//                         url,
//                         status: res.status,
//                     });
// // 
//                     return RedirectedLinks.test(res.headers.get('Location'), settings);
//                 } else {
//                     links.push({
//                         url,
//                         status: res.status,
//                     });
//                 }
//             });
//         } catch (error){
//             console.log(error);
//             return ({
//                 url,
//                 error: "This is invalid url"
//             });
//         }
//         return links
//     }
// }
// // 
// module.exports = RedirectedLinks
const fetch = require('node-fetch');

class RedirectedLinks {
    static async linkTest(link, param = []) {
        let url;
        let status;

        await fetch(link, {
            redirect: 'manual'
        }).then((res) => {
            url = res.link; status = res.status;
            param.push({ url, status }); if (res.status !== 200 && res.headers.get('location') !== null) {
                return RedirectedLinks.linkTest(res.headers.get('location'), param);
            }
        }).catch((err) => {
            console.log(err);
            return param.push({
                                link,
                                error: "This is invalid link."
                            });
        });
        return param;
    }
}
module.exports = RedirectedLinks;