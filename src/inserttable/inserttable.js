//connect DB use knex.js
const { option } = require("../../connectSQL");
const { changeing } = require("../models/urls.model");
const UrlService = require('../service/url.service')


const knex = require('knex')(option);

//inserting table , first subprocess

class Insert {



    static async insertTable(info) {

        let linksDatas;
        let urlsDatas;

        for (let ur = 0; ur < info.length; ur++) {


            linksDatas = [
                { urls: info[ur].link, robot_tag: info[ur].robot_tag, title: info[ur].title, favicon: info[ur].favicon, status: info[ur].status, created_at: new Date() }
            ]

            //insert Unique data

            const infoAboutJoinsLinks = await knex('links').insert(linksDatas).onConflict('urls').merge().returning(['urls', 'id']);


            let informations = info[ur].externalInfo

            for (let lin = 0; lin < informations.length; lin++) {
                // console.log(informations[lin].url.length,'length');
                let uniqueUrl = informations[lin].url.split('?v=')

                urlsDatas = [
                    {
                        external_urls: uniqueUrl[0],
                        rel: informations[lin].rel,
                        keyword: informations[lin].keyword,
                        created_at: new Date(),
                        links_id: infoAboutJoinsLinks[0].id,
                        main_link: infoAboutJoinsLinks[0].urls,
                        robot: "indexable",
                        status: 200,


                    }

                ]

                //insert Unique data

                const infoAboutJoinsUrls = await knex('urls').insert(urlsDatas).returning('*')


            }
        }




    }


}

module.exports = Insert