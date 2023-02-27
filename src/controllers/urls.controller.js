const UrlsModel = require('../models/urls.model.js')
const LinkService = require('../service/link.service')
const CheckerLinks = require('../service/linksChecker');
const RedirectedLinks = require('../service/links.redirected')
const UrlService = require('../service/url.service')
const child_process = require('child_process');
const insertTable = require('../inserttable/inserttable')
const OnlyStatusChecker = require('../service/mainLinks.redirect')
// const temp = require('../Clusterization/cluster')
// const clusterDouble = require('../Clusterization/cluster')

class UrlsController {

  static async addChange(req, res, next) {
    try {
      const { campaign_id } = req.body
      const urls = await UrlsModel.addChange(campaign_id);
      res.send('success')
    } catch (error) {
      next(error);
    }
  }

  static async test(req, res, next) {
    try {
      const val = req.body;
      let data = []
      const url = Object.values(val);
      console.log(url);
      let info2;
      for (let e = 0; e < url.length; e++) {
        console.log(url[e]);
         info2 = await CheckerLinks.linkTest(url[e]);
          data.push(info2) 
      }
      console.log(data,"aaa");
      const worker = child_process.fork('src/Clusterization/cluster.js')
        worker.on('message', async function (msg) {
          for(let i = 0; i < url.length; i++ ){
          var extrs = data[i][0].externalInfo;
          console.log(extrs,"hasanq");
          let arr3 = extrs
            .filter(obj1 => msg.some(obj2 => obj2.url === obj1.url))
            .map(obj1 => {
              let obj2 = msg.find(obj => obj.url === obj1.url);
              return { ...obj1, ...obj2 };
            });
  data[i][0].externalInfo = arr3
          }
          console.log(data,"data");
          res.send(data)
        })
        
        // if(inform !== undefined){
          // res.send(inform);
        // }
        // dataOfExternals = [];
    } catch (error) {
      next(error);
    }
  }

  static async addLinks(req, res, next) {
    try {
      const val = req.body;
      const url = await insertTable.insertTable(val);
      res.send({success : true})
    } catch (error) {
      next(error);
    }
  }

  static async deleteUrls(req, res, next) {
    try {
      const {id} = req.body;
      const url = await UrlsModel.deleteUrls(id);
      res.send(url)
    } catch (error) {
      next(error);
    }
  }
  static async getLiveUrls(req, res, next) {
    try {
      // const {id} = req.body;
      const url = await UrlsModel.getLiveUrls();
      res.send(url)
    } catch (error) {
      next(error);
    }
  }

  static async getCrawled(req, res, next) {
    try {
      
      const url = await UrlsModel.getCrawled();
      res.send(url)
    } catch (error) {
      next(error);
    }
  }

  static async getCrawledById(req, res, next) {
    try {
      const { id } = req.params;

      const url = await UrlsModel.getCrawledById(id);
      res.send(url)
    } catch (error) {
      next(error);
    }
  }


  static async getCrawledLinksCountById(req, res, next) {
    try {
      const { id } = req.params;

      const url = await UrlsModel.getCrawledLinksCountById(id);
      res.send(url)
    } catch (error) {
      next(error);
    }
  }

  static async fullOnlyStatus(req, res, next) {
    let data;
    let dataOfExternals = [];
    try {
      const urls = req.body;
      for (let e = 0; e < urls.length; e++) {
        data = await OnlyStatusChecker.linkTest(urls[e]);
        dataOfExternals.push(data)
      }  
      if(dataOfExternals[0][0].error === "We don't have access for information" || dataOfExternals[0][0].status === 404){
        res.send(500, dataOfExternals)
      }else {
        res.send(dataOfExternals)
      }
      dataOfExternals = []
      data = []
    } catch (error) {
      next(error)
    }
  }
  


  static async getFailed(req, res, next) {
    try {
      
      const url = await UrlsModel.getFailed();
      res.send(url)
    } catch (error) {
      next(error);
    }
  }

}

module.exports = UrlsController;