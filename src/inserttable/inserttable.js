const { option } = require("../../connectSQL");
const knex = require('knex')(option);

class Insert {
    static async insertTable(info) {
        let linksDatas;
        let urlsDatas;
        for (let ur = 0; ur < info.length; ur++) {
console.log(info.length);
            linksDatas = [
                { urls: info[ur].link, robot_tag: 'index', title: info[ur].title, favicon: info[ur].favicon, status: info[ur].status, change: null ,created_at:new Date()},

            ]

            knex('links').insert(linksDatas)
                .then(() => console.log("data inserted"))
                .catch((err) => { console.log(err); throw err })

            let informations =  info[ur].externalInfo
         

            for(let lin = 0;lin < informations.length;lin++){
                urlsDatas = [
                    {external_urls:informations[lin].url,rel:informations[lin].rel,keyword:informations[lin].keyword,created_at:new Date()}
                ]
                knex('urls').insert(urlsDatas)
                .then(() => console.log("data inserted"))
                .catch((err) => { console.log(err); throw err })

            }
        }
    }
}

module.exports = Insert