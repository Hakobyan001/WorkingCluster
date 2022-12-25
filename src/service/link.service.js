


const fetch = require("node-fetch");
const Insert = require("../inserttable/inserttable")


class LinkService {

  static async test(links) {
    const aRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>[^<]*<\/a>/g;
    const titleRegex = /<title[^>]*>([\s\S]*?)<\/title>/;
    const robotsRegex = /<meta[^>]*?name=["']robots["'][^>]*?>/i;
    const faviconRegex = /<link[^>]*(?:rel\s*=\s*['"](?:shortcut icon|icon)['"][^>]*)\s*href\s*=\s*['"]([^'"]*)['"][^>]*>/i;
    const aTags = [];
    const htmlOfLinks = [];
    const htmlOfExternals = [];
    const mainStatuses = [];
    const externalStatuses = [];
    const aExternals = [];
    const info = [];
    const hrefValues = [];
    const keywords = [];
    const title = [];
    const robots = [];
    const robotsOfExternals = [];
    const favicons = [];
    const externalInfo = [];
    
    const dataMain = await Promise.all(links.map((elem) => fetch(elem)));

    for (let elem of dataMain) {
      //Receive text of HTML
      let mainText = await elem.text();
      htmlOfLinks.push(mainText)
      //Receive statuses of Links
      mainStatuses.push(elem.status);
    }

    for (let i = 0; i < links.length; i++) {
      try {
        externalInfo.push([]);
        aTags.push(htmlOfLinks[i].match(aRegex));
        aExternals.push([...new Set(aTags[i])].filter((el) => !el.includes(`${links[i]}/`) && el.includes('https://') && !el.endsWith('.js') && !el.endsWith('.css') && !el.endsWith('.html') || !el.includes(`${links[i]}/`) && el.includes('http://') && !el.endsWith('.js') && !el.endsWith('.css') && !el.endsWith('.html')));
        title.push(htmlOfLinks[i].match(titleRegex));
        robots.push(String(htmlOfLinks[i].match(robotsRegex)));
        favicons.push(htmlOfLinks[i].match(faviconRegex));

        //Getting External links
        hrefValues.push(aExternals[i].map(aTag => {
          const matches = aTag.match(/(?<=href=")[^"]+/g);
          return matches ? matches[0] : null;
        }));

        //Getting Keywords of Main links
        keywords.push(aExternals[i].map(string => {
          const match = string.match(/<a[^>]*>([^<]*)<\/a>/);
          if (match) {
            return match[1];
          }
        }));

        //Creating object for All Information of Main link
        info.push(
          {
            link: links[i],
            externals: [aExternals[i].length],
            title: title[i] === null ? title[i] : title[i][1],
            robot_tag: robots[i] === undefined || !robots[i].includes('noindex')  || robots[i] === null ? 'indexable' : 'noindexable',
            favicon: favicons[i] === null ? favicons[i] : links[i] + '/' + favicons[i][1],
            status: mainStatuses[i],
            externalInfo: externalInfo[i]
          }
        )

        // for (let y = 0; y < hrefValues[i].length; y++) {
        //   const dataExternal = await Promise.all(hrefValues[i].map((elem) => fetch(elem)));
        //   for (let elem of dataExternal) {
        //   //Receiving Externals text from HTML
        //     let externalsText = await elem.text();
        //     htmlOfExternals.push(externalsText);
        //   //Getting statuses of externals links
        //     externalStatuses.push(elem.status);
        //   }
        //   robotsOfExternals.push(String(htmlOfExternals[y].match(robotsRegex)));
        // }

          //Pushing Information about external links
        for (let x = 0; x < aExternals[i].length; x++) {
          externalInfo[i].push({
            url: hrefValues[i][x],
            rel: aExternals[i][x].includes('nofollow') ? "nofollow" : "dofollow",
            keyword: aExternals[i][x].includes(keywords[i][x]) && keywords[i][x] !== '' ? keywords[i][x] : "null",
            // robot_tag: robotsOfExternals[i] === undefined || !robotsOfExternals[i].includes('noindex') ||
            // robotsOfExternals[i] === null ? 'indexable' : 'noindexable',
            // status: externalStatuses[i]
          })
        }
      } catch (error) {
        for (let x = 0; x < aExternals[i].length; x++) {
          externalInfo[i].push({
            url: hrefValues[i][x],
            rel: aExternals[i][x].includes('nofollow') ? "nofollow" : "dofollow",
            keyword: aExternals[i][x].includes(keywords[i][x]) && keywords[i][x] !== '' ? keywords[i][x] : "null",
            robot_tag: robotsOfExternals[i] === undefined || !robotsOfExternals[i].includes('noindex') || robotsOfExternals[i] === null ? 'indexable' : 'noindexable',
            status: String(error).includes(hrefValues[i][x]) ? 'failed' : 200
          })
        }
      }

    }

   const infoLinks = await Insert.insertTable(info);
   return info;


  }
}

module.exports = LinkService;