//NPM MODULES
const { groupBy } = require("async");
const { option } = require("../../connectSQL");
const knex = require('knex')(option);

let rell = []

//Connect myDB's Tables

 class Data {

  static async getUrls() {

    const selectNullableData = await knex.from('urls').select('external_urls', 'id')
    .orderBy('id')

      return selectNullableData;


  }

  static async linksChange() {
    const change = await knex.from('links').select('urls', 'robot_tag', 'title', 'favicon', 'status', 'id').orderBy('id').where('changeing',null)
    if(change){
      
      return change
    }else{
      console.log('թարմացնելու  տվյալներ չկան․․․')
    }
    
  }

  static async getNull() {
    const nullData = await knex.from('urls').select('id').where('changeing', null)
    if(nullData.length > 0){
      return nullData.length
    }else{
      console.log('թարմացնելու  տվյալներ չկան․․․')
    }
  }

  static async getLinks(offset, limit) {
    const y = await knex.from('links').select('urls', 'id').orderBy('id').limit(limit).offset(offset)
    return y
  }

  static async getIds() {
    console.log(111);
    const z = await knex.from('urls').select('id').orderBy('id').where('changeing',null)
    console.log(z, 2222);
    return z

  }
  static async changeing() {
    const changerel = await knex.from('urls').select('rel', 'id').orderBy('id');
    const changekeyword = await knex.from('urls').select('keyword', 'id').orderBy('id');

    return [changerel, changekeyword]

  }
  static async getLimit() {
    const count = await knex.from('urls').select('id').groupBy('id')
    if(count.length > 0){
      return count.length
    }else{
      console.log('թարմացնելու  տվյալներ չկան․․․')
    }

  }


}
module.exports = Data

