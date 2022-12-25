const UrlsModel = require('../models/urls.model.js')
const LinkService = require('../service/link.service')
// const CheckerLinks = require('../service/linksChecker');

// let x;

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
      let domains = []
      const url = Object.values(val);
      console.log(url);
      let link = await LinkService.fullInformationAboutExternals(url);
      res.send(link)
    } catch (error) {
      next(error);
    }
  }
  static async test(req, res, next) {
    try {
      const val = req.body;
      let domains = []
      const url = Object.values(val);
      console.log(url);
      let info = await LinkService.test(url);
      res.send([info])
    } catch (error) {
      next(error);
    }
  }
  // static async checker(req, res, next) {
  //   try {
  //     const { urls } = req.body;
  //     console.log(urls);
  //     await Promise.all(urls.map(async (url) => {

  //       const currUrl = url;
  //       const setingss = { redirect: 'manual' };

  //     x =  await CheckerLinks.linksTest(currUrl, setingss);

  //     }))
  //     res.send(x)
    
  //   }catch (error) {
  //     next(error)
  //   }
  // }

}

module.exports = UrlsController;