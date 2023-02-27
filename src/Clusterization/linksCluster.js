// / Modules from this project
const cluster = require('cluster');
const CheckInfo = require('../service/checkInfo');
const Data = require('../models/urls.model');
const process = require('node:process');
const Change = require('../models/urls.model')

const { option } = require("../../connectSQL");
const knex = require('knex')(option);
const numCPUs = require('os').cpus().length;

let start = 0;
let end = 0;
const step = 3;
let worker = [];
const limit = 18;

async function isPrimary() {
  if (cluster.isPrimary) {
    const links = await Data.getLinks(0, limit);


    // console.log(links, 'links');


    for (let i = 0; i < numCPUs; i += 1) {
      worker.push(cluster.fork());
      start = step * i;
      end = start + step;

      worker[i].send(links.slice(start, end));

      worker[i].on('message', async (msg) => {

        console.log(msg, 'msg');
        const val = Change.changeing().then(async (elem) => {
          console.log(msg.data,"aa");
          if(msg.data[2].length > 0){
                    
                    for (let r = 0; r < elem[1].length; r++) {



                      if(elem[0][r].rel !== msg.data[1][r]|| elem[1][r].keyword !== msg.data[2][r] && (elem[1][r].status !== msg.data[3][r].status || elem[0][r].robot_tag !== msg.data[3][r].robot_tag)){
                        informationalResponses = await knex
                        .from('urls')              
                        .where("id",'=',elem[0][r].id)
                        .update({ changeing: {"oldRel": "${elem[0][r].rel}" , "newRel": "${msg.data[1][r]}" , "oldKeyword":"${elem[1][r].keyword}" , "newKeyword":"${msg.data[2][r]}"}})
                        // .update({changeing_status:{"oldStatus":"${elem[1][r].status}","newStatus":"${msg.data[3][r].status}","oldRobot":"${elem[0][r].robot_tag}","newRobot":"${msg.data[3][r].robot_tag}"}})
                        // .update({updated_at:new Date()})
                        .where('changeing',null);
                        console.log('table updated first',informationalResponses);

                       }
                     }  
                  }
              }
        )
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
          const val = Change.changeing().then(async (elem) => {
       
            if(msg.data[2].length > 0){
          
                      for (let r = 0; r < elem[1].length; r++) {

                        if(elem[0][r].rel !== msg.data[1][r]|| elem[1][r].keyword !== msg.data[2][r] && (elem[1][r].status !== msg.data[3][r].status || elem[0][r].robot_tag !== msg.data[3][r].robot_tag)){
                          informationalResponses = await knex
                          .from('urls')              
                          .where("id",'=',elem[0][r].id)
                          .update({ changeing: {"oldRel": "${elem[0][r].rel}" , "newRel": "${msg.data[1][r]}" , "oldKeyword":"${elem[1][r].keyword}" , "newKeyword":"${msg.data[2][r]}"}})
                          .where('changeing',null);
                          console.log('table updated second',informationalResponses);

                         }
                       }  
                    }
                }
          )
        });

        worker[numCPUs - 1].on('error', (error) => {
          console.log(error);
        });
      }
    });
  } else {
    process.on('message', async (msg) => {
      process.send({ data: await CheckInfo.checkInfo(msg) });
      process.kill(process.pid);
    });
  }
}

isPrimary();
