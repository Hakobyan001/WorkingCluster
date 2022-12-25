//NPM MODULES
const { option } = require("../../connectSQL");
const knex = require('knex')(option);
const UrlService = require("../service/url.service")

let psqldata;
module.exports = class Data {
  static async getUrls(offset, limit) {

    knex.from('urls').select('external_urls','id').offset(offset).limit(limit)
      .then((rows) => {
        
        for (let row of rows) {

 psqldata = UrlService.checkUrls(row)
        }
        return psqldata


})
.catch((err) => { console.log(err); throw err; })
.finally(() => {

knex.destroy();
});
}
}



