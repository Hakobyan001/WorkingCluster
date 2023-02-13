const fetch = require('node-fetch');
const robotsRegex = /<meta[^>]*?name=["']robots["'][^>]*?>/i;
// const Insert = require('../Clusterization/cluster');
// const { inserting} = require('../Clusterization/cluster')

let info = {url:[],robot_tag:[],status:[]};

class UrlService {
  static async checkUrls(domain) {
    let alfa = [];
    let unexts = [];
    for(let k = 0; k<domain.length; k++) {
      alfa.push(domain[k].external_urls);
    }
    unexts = alfa;

    const externalStatus = []
    const robotExternals = [];
    const info = [];
    const info1 = [];
    const information = [];
    const urlAndRobot = {urlRobot:[]}
    const urlAndStatus = { urlStatus:[],status:[]}

    if (unexts.length > 0) {
      let success;
      const fetchData = async link => {
        try {
          const response = await fetch(link, { redirect: "manual" });
          const data = response;
          return { status: "fulfilled", value: data };
        } catch (error) {
          return {
            status: "rejected", value: {
              status: 503,
              aborted: false,
            },
          }
        }
      }

      const dataExternal = await Promise.allSettled(unexts.map(fetchData))
      .then(results => {
        results.forEach((result, index) => {
          if (String(result.value.value.cause).includes('Error: Client network') && String(result.value.value.code).includes('UND_ERR_SOCKET')) {
            info1.push({
              url: unexts[index],
              text: 'null',
              status: 404
            })
            externalStatus.push(503)
          } else if (result.value.status === "rejected") {
            const texts = result.value.value;
            information.push({
              url: unexts[index],
              text: texts
            })
            info1.push({
              url: unexts[index],
              text: 'null',
              status: 503
            })
          } else if (result.value.status === "fulfilled") {
            const texts = result.value.value;
            success = result.value.value.status
            externalStatus.push(success);
            information.push({
              url: result.value.value.url,
              text: texts
            })
          }
        });
      })
      .catch((err) => {
        console.log(err);
        externalStatus.push(404);
      })


        await Promise.allSettled(information.map(async (elem,index) => {
          info1.push({
            url: elem.url,
            text: await elem.text.text(),
            status: information[index].text.status
          })
        }));

        for (let x = 0; x < info1.length; x++) {      
          robotExternals.push(String(info1[x].text.match(robotsRegex)));
          info.push({
            url: info1[x].url,
            status: info1[x].status || 508,
            robot_tag: robotExternals[x] === 'null' || robotExternals[x] === undefined || !robotExternals[x].includes('noindex') ? 'indexable' : 'noindexable',
          })
        }

        for(let int in info){
          if(info[int].robot_tag === 'noindexable'){
            urlAndRobot.urlRobot.push(info[int].url);
            
          }if(info[int].status !== 200){
             urlAndStatus.urlStatus.push(info[int].url);
             urlAndStatus.status.push(info[int].status);
          }
        }
      }
      return [urlAndStatus,urlAndRobot]
      // const exportData = await inserting([urlAndStatus,urlAndRobot])
    }
}

module.exports = UrlService;


// static async checkInfoFromMain(domain) {
  //   const mainStatus = [];
  //   const robotOfMain = [];
  //   const favicons = [];
  //   const mainInfo = [];
  //   const htmlOfMain = [];
  //   const dataMain = await Promise.all(domain.map((elem) => fetch(elem)));
  //   for (let elem of dataMain) {
  //     //Receive text of HTML
  //     let exText = await elem.text();
  //     htmlOfMain.push(exText)
  //     //Receive statuses of Links
  //     mainStatus.push(elem.status);
  //   }

  //   for (let i = 0; i < domain.length; i++) {
  //     robotOfMain.push(String(htmlOfMain[i].match(robotsRegex)));
  //     favicons.push(htmlOfMain[i].match(faviconRegex));
  //     //Creating object for All Information of External link
  //     console.log(robotOfMain, 87987);
  //     mainInfo.push(
  //       {
  //         url: domain[i],
  //         robot_tag: robotOfMain[i] === undefined || !robotOfMain[i].includes('noindex') || robotOfMain[i] === null ? robotOfMain[i] = 'indexable' : robotOfMain[i] = 'noindexable',
  //         status: mainStatus[i],
  //         favicon: !favicons[i] ? "null" : (favicons[i][1].includes('https://') ? favicons[i][1] : domain[i] + '/' + favicons[i][1]),
  //       }
  //     )
  //   }
  //   return mainInfo
  // }