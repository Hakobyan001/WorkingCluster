//NPM MODULES
const { groupBy } = require("async");
const { option } = require("../../connectSQL");
const knex = require('knex')(option);

let rell = []
let date_1;
let date_2;
let days;
//Connect myDB's Tables

class Data {

  static async insertUrls(data) {
    for (let int in data) {
      const insertData = await knex('urls').insert({ external_urls: data[int] })

    }

  }
  static async delData(offset, limit) {
    await knex('urls').del().limit(limit).offset(offset)
  }


  static async getUrls() {

    const selectNullableData = await knex.from('urls').select('external_urls',)
      .orderBy('id')

    return selectNullableData;


  }

  static async linksChange() {
    const change = await knex.from('links').select('urls', 'robot_tag', 'title', 'favicon', 'status', 'id').orderBy('id').where('changeing', null)
    if (change) {

      return change
    } else {
      console.log('թարմացնելու  տվյալներ չկան․․․')
    }

  }

  static async getNull() {
    const nullData = await knex.from('urls').select('id').where('changeing', null)
    if (nullData.length > 0) {
      return nullData.length
    } else {
      console.log('թարմացնելու  տվյալներ չկան․․․')
    }
  }

  static async getLinks(offset, limit) {
    const y = await knex.from('links').select('urls', 'id').orderBy('id').limit(limit).offset(offset)
    return y
  }

  static async getIds() {
    const z = await knex.from('urls').select('id').orderBy('id').where('changeing', null)
    return z

  }
  static async changeing() {
    const changerel = await knex.from('urls').select('rel', 'external_urls', 'id').orderBy('id');
    const changekeyword = await knex.from('urls').select('keyword', 'id').orderBy('id');

    return [changerel, changekeyword]

  }
  // static async getExternalsForChanges() {
  //   const externals = await knex.from('urls').select('external_urls','id').groupBy('id')
  //   return externals 

  // }

  static async getLimit() {
    const count = await knex.from('urls').select('id').groupBy('id')
    if (count.length > 0) {
      return count.length
    } else {
      console.log('թարմացնելու  տվյալներ չկան․․․')
    }

  }
  static async deleteUrls(ids) {
    const delLinks = await knex.from('links').del().whereIn('id', ids).returning('*');
    const delUrls = await knex.from('urls').del().whereIn('links_id', ids).returning('*');

    return [delLinks, delUrls]
  }


  static async getLiveUrls() {
    const getLive = await knex.from('urls').count('id').where('status', '=', 200)
    console.log(getLive);

    return getLive
  }

  static async getCrawled() {
    let countupdate = [];
    let leftcountupdate = [];


    const getDofollow = await knex.from('urls').count('id').where('rel', '=', 'dofollow');
    const getNofollow = await knex.from('urls').count('id').where('rel', '=', 'nofollow');
    const selsectTimestamp = await knex.from('urls').select('created_at')

    for (let index = 0; index < selsectTimestamp.length; index++) {
      date_1 = selsectTimestamp[0].created_at
      date_2 = new Date();


      days = (date_1, date_2) => {
        let difference = date_1.getTime() - date_2.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
      }
      console.log(days, "days");

      console.log(days(date_1, date_2));
      if (days(date_1, date_2) < 1) {

        countupdate.push(days(date_1, date_2));

      } else {
        leftcountupdate.push(days(date_1, date_2))
      }
    }


    return { "dofollowCount": Number(getDofollow[0].count), "nofollowCount": Number(getNofollow[0].count), "crawledTodayCount": countupdate.length, "leftForCrawlingCount": leftcountupdate.length }



  }

  static async getCrawledById(id) {
    let countupdate = [];
    let leftcountupdate = [];


    const getDofollow = await knex.from('urls').count('id').where('rel', '=', 'dofollow').andWhere('user_id', '=', id);
    const getNofollow = await knex.from('urls').count('id').where('rel', '=', 'nofollow').andWhere('user_id', '=', id);
    const selsectTimestamp = await knex.from('urls').select('created_at').where('user_id', '=', id);

    for (let index = 0; index < selsectTimestamp.length; index++) {
      date_1 = selsectTimestamp[0].created_at
      date_2 = new Date();


      days = (date_1, date_2) => {
        let difference = date_1.getTime() - date_2.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
      }
      console.log(days, "days");

      console.log(days(date_1, date_2));
      if (days(date_1, date_2) < 1) {

        countupdate.push(days(date_1, date_2));

      } else {
        leftcountupdate.push(days(date_1, date_2))
      }
    }


    return { "dofollowCount": Number(getDofollow[0].count), "nofollowCount": Number(getNofollow[0].count), "crawledTodayCount": countupdate.length, "leftForCrawlingCount": leftcountupdate.length }



  }


  static async getCrawledLinksCountById(id) {
    const links = await knex.from('links').count('id').where('user_id', '=', id);
    return links;
  }

  static async getFailed() {
    const failedData = await knex.from('urls').count('id').whereNotNull('changeing')
    return failedData

  }


}
module.exports = Data

