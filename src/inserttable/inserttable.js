//connect DB use knex.js
const { option } = require("../../connectSQL");
const { changeing } = require("../models/urls.model");
// const UrlService = require('../service/url.service')


const knex = require('knex')(option);

//inserting table , first subprocess
let campaign_id = 0;

class Insert {



    static async insertTable(info) {
        const links = Object.keys(info)[0]
        const alfa = Object.values(info)
        console.log(alfa);
        // console.log(Object.keys(alfa));

        let linksDatas;
        let urlsDatas;
        for (let ur = 0; ur < alfa.length; ur++) {
            if(ur === alfa.length - 1) {
                campaign_id = campaign_id + 1           
            }
            linksDatas = [
                { urls: links, robot_tag: alfa[ur].robot_tag, title: alfa[ur].title, favicon: alfa[ur].favicon, status: alfa[ur].status, created_at: new Date(),campaign_id: campaign_id }
            ]

            //insert Unique data

            const alfaAboutJoinsLinks = await knex('links').insert(linksDatas).onConflict('urls').merge().returning(['urls', 'id']);

            let insertUrls = alfa[ur].externalInfo

            for (let lin = 0; lin < insertUrls.length; lin++) {
                // console.log(alfarmations[lin].url.length,'length');
                let uniqueUrl = insertUrls[lin].url.split('?v=')

                urlsDatas = [
                    {
                        external_urls: uniqueUrl[0],
                        rel: insertUrls[lin].rel,
                        keyword: insertUrls[lin].keyword,
                        created_at: new Date(),
                        links_id: alfaAboutJoinsLinks[0].id,
                        main_link: alfaAboutJoinsLinks[0].urls,
                        robot: "indexable",
                        status: 200,
                        campaign_id:campaign_id


                    }

                ]

                //insert Unique data
                const alfaAboutJoinsUrls = await knex('urls').insert(urlsDatas).returning('*')


            }
        }




    }


}

module.exports = Insert