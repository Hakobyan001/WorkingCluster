const fetch = require('node-fetch');
// const Cluster = require('../../src/Clusterization/clusterr')

let rTags = [];
let externalStatus = []
let idOfexternals = []
let robotExternals;
class UrlService {
  static async checkUrls(domain) {
    console.log(domain);

    const items = [];

    const robotsRegex = /<meta[^>]*?name=["']robots["'][^>]*?>/i;
    const item = domain.external_urls
    items.push(item)
    idOfexternals.push(domain.id)

    // console.log(idOfexternals);


    await Promise.allSettled(items.map((res) => fetch(res)))
      .then((res) => {
        for (let index = 0; index < res.length; index++) {
          externalStatus.push(res[index].value.status);
        }

      })

    // console.log(externalStatus);
    robotExternals = await Promise.all(items.map((res) => fetch(res)))

    for (let rob of robotExternals) {
      let robots = await rob.text();
      let robot_tag = robots.match(robotsRegex);
      if (robot_tag !== null) {
        for (let r of robot_tag) {
          if (r.includes('index')) {
            robot_tag = 'indexable'
            rTags.push(robot_tag)

          } else {
            robot_tag = 'noindexable'
            rTags.push(robot_tag)
          }
        }
      } else if (robot_tag === null) {
        robot_tag = 'indexable'
        rTags.push(robot_tag)

      }



    }
// console.log([idOfexternals, externalStatus, rTags])
 const v = await Cluster.cluster([idOfexternals, externalStatus, rTags])
    return  [idOfexternals, externalStatus, rTags]

  }


}


module.exports = UrlService;
