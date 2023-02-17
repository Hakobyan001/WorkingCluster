
// Modules from this project
const cluster = require('cluster');
const UrlService = require('../service/url.service');
const Data = require('../models/urls.model');
const Count = require('../models/urls.model');
const UrlsController = require('../controllers/urls.controller')

const { option } = require("../../connectSQL");
const knex = require('knex')(option);

const numCPUs = require('os').cpus().length;

let start = 0;
let end = 0;
let worker = [];



// const temp = []
// module.exports = temp


async function isPrimary() {

  if (cluster.isPrimary) {

    const step = await Count.getLimit();
    const limit = await Count.getLimit();

    const links = await Data.getUrls();
    console.log(links,'links');
    await Data.delData(0,links.length)


    for (let i = 0; i < numCPUs; i += 1) {
      worker.push(cluster.fork());
      start = step * i;
      end = start + step;

      worker[i].send(links.slice(start, end));
      worker[i].on('message', async (msg) => {
        if(msg.data[0]){
          process.send(msg.data);
        }
        
        // temp.push(msg.data)
        // console.log(msg.data);
        // return  msg.data
          //     for (let int in msg.data[0].urlStatus) {


          //         const insertStatus = await knex
          //             .from('urls')
          //             .update({status: msg.data[0].status[int]})
          //             .where('external_urls', '=', msg.data[0].urlStatus[int]);

          //         console.log(insertStatus);


          // }

            // for (let ind in msg.data[1].urlRobot) {

            //     const insertRobot = await knex
            //         .from('urls')
            //         .update({robot: 'noindexable'})
            //         .where('external_urls', '=', msg.data[1].urlRobot[ind])

            //     console.log(insertRobot);
            // }

      });

      worker[i].on('error', (error) => {
        console.log(error);
      });
    }

    cluster.on('exit', async (currWorker) => {
      start = end;
      end = start + step;

      if (end <= limit) {
        worker = worker.filter((w) => w.id !== currWorker.id);

        worker.push(cluster.fork());

        const chunk = links.slice(start, end);
        console.log('INIT start, end => ', start, end);
        worker[numCPUs - 1].send(chunk);

        worker[numCPUs - 1].on('message', async (msg) => {
          if(msg.data[0]){
            process.send(msg.data);
          }
          

          // console.log(msg.data);
                // console.log(12)
                // for (let int in msg.data[0].urlStatus) {

                //     const index1 = msg.data[0].urlStatus[int].indexOf('?');
                //     alfa.push(msg.data[0].urlStatus[int].slice(0, index1))

                //     const insertStatus = await knex
                //         .from('urls')
                //         .update({status: msg.data[0].status[int]})
                //         .where('external_urls', '=', alfa[int])

                //     console.log(insertStatus);

                // }
                // for (let ind in msg.data[1].urlRobot) {
                //     const index2 = msg.data[1].urlRobot[ind].indexOf('?');
                //     betta.push(msg.data[1].urlRobot[ind].slice(0, index2))
                //     const insertRobot = await knex
                //         .from('urls')
                //         .update({robot: 'noindexable'})
                //         .where('external_urls', '=', betta[ind])

                //     console.log(insertRobot);
                // }
                

        });

        worker[numCPUs - 1].on('error', (error) => {
          console.log(error);
        });
      }

    });
  } else {
    process.on('message', async (msg) => {
        process.send({ data: await UrlService.checkUrls(msg) });

        process.kill(process.pid);
        
    });
  }
}
isPrimary()