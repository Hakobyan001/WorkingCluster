const UrlsModel = require('../models/urls.model.js')
const LinkService = require('../service/link.service')
const CheckerLinks = require('../service/linksChecker');
const RedirectedLinks = require('../service/links.redirected')
const UrlService = require('../service/url.service')
const child_process = require('child_process');

class UrlsController {
  static async getAllUrls(req, res, next) {
    try {
      const { offset, limit } = req.query;
      const url = await UrlsModel.getUrls(offset, limit);
      res.send(url)
    } catch (error) {
      next(error)
    }
  }
  static async postLinks(req, res, next) {
    try {
      const val = req.body;
      const link = Object.values(val);
      console.log(link);
      const url = await LinkService.fullInformationAboutLinks(link);
      res.send(url);
    } catch (error) {
      next(error);
    }
  }

  static async postExternals(req, res, next) {
    try {
      const val = req.body;
      const url = Object.values(val);
      console.log(url);
      let link = await LinkService.fullInformationAboutExternals(url);
      res.send(link)
    } catch (error) {
      next(error);
    }
  }
  // static async test(req, res, next) {
  //   let dataOfExternals = [];

  //   try {
  //     const val = req.body;
  //     // let domains = []
  //     const url = Object.values(val);
  //     console.log(url);
  //     // let info = await LinkService.test(url);
  //     for (let e = 0; e < url.length; e++) {

  //     let info = await CheckerLinks.linkTest(url[e]);
  //     dataOfExternals.push(info) 


  //     }
  //     const worker = child_process.fork('src/Clusterization/cluster.js')
  //       worker.on('close', function (code) {
  //         console.log(code, 123132131313131);
  //       })
  //       res.send(dataOfExternals);
  //       dataOfExternals = [];
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  static async test(req, res, next) {
    // let dataOfExternals = [];

    try {
      const val = req.body;
      let data = []
      const url = Object.values(val);
      console.log(url);
      // let info = await LinkService.test(url);
      let info2;
      for (let e = 0; e < url.length; e++) {
         info2 = await CheckerLinks.linkTest(url[e]);
          data.push(info2) 
      }
      const worker = child_process.fork('src/Clusterization/cluster.js')
        worker.on('close', function (code) {
          console.log(code, 123132131313131);
        })
        res.send(data);

        // dataOfExternals = [];
    } catch (error) {
      next(error);
    }
  }
  static async checker(req, res, next) {
    try {
      const urls = req.body;
      let data;
      for (let e = 0; e < urls.length; e++) {
        const setingss = { redirect: 'manual' };
        data = await CheckerLinks.linksTest(urls[e], setingss);
        dataOfExternals.push(data)
      }
      res.send([dataOfExternals])
      dataOfExternals = []

    } catch (error) {
      next(error)
    }
  }
  static async redirected(req, res, next) {
    try {
      const urls = req.body;
      let data;
      for (let e = 0; e < urls.length; e++) {

        const setingss = { redirect: 'manual' };

        data = await RedirectedLinks.linksTest(urls[e], setingss);
        dataOfExternals.push(data)
      }
      res.send([dataOfExternals])
      dataOfExternals = []

    } catch (error) {
      next(error)
    }
  }

  static async freeRequest(req, res, next) {
    try {
      const val = req.body;
      const link = Object.values(val);
      console.log(link);
      const url = await UrlService.checkInfoFromMain(link);
      res.send(url);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = UrlsController;