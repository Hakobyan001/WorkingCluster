


const express = require("express")
const Api = require('../api/urls.api');

const app = express()

const PORT = process.env.PORT || 8090

app.use(express.json())

app.use('/api/v1', Api);


// Modules from this project
const  cluster = require('cluster');
const { option } = require("../../connectSQL");
const knex = require('knex')(option);
const UrlService = require( '../service/url.service');
const UrlsModel = require('../models/urls.model')
// import { UrlsModel } from '../models';




const numCPUs = require('os').cpus().length;
console.log(numCPUs);

let start = 0;
let end = 0;
const step = 20;
let worker = [];
const limit = 320;

async function isPrimary() {
  if (cluster.isPrimary) {
   
    const net = require('net');

const client = new net.Socket();
client.connect(PORT, 'localhost', async function() {
  console.log('Connected');
  app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}`);
  });
  const links = await UrlsModel.getUrls();
  console.log(links,878787878787);
  client.write('Hello, server! Love, Client.');
});

client.on('error', function(err) {
  if (err.code === 'EPIPE') {
    console.error('Got an EPIPE error while writing to the socket');
  // } else {
  //   console.error(err);
  // }
  }
});
    // console.log(links,8787887878);
    for (let i = 0; i < numCPUs; i += 1) {
      worker.push(cluster.fork());
      start = step * i;
      end = start + step;

      // worker[i].send(links.slice(start, end));

      worker[i].on('message', async (msg) => {
        console.log(msg);
        const informationalResponses = await knex
          .from('links')
          .whereIn('id', msg.data[0])
          .update({ status: 'informationalResponses' });

        console.log('Table updated', informationalResponses);

        const successfulResponses = await knex
          .from('links')
          .whereIn('id', msg.data[1])
          .update({ status: 'successfulResponses' });

        console.log('Table updated', successfulResponses);

        const redirectionMessages = await knex
          .from('links')
          .whereIn('id', msg.data[2])
          .update({ status: 'redirectionMessages' });

        console.log('Table updated', redirectionMessages);

        const clientErrorResponses = await knex
          .from('links')
          .whereIn('id', msg.data[3])
          .update({ status: 'clientErrorResponses' });

        console.log('Table updated', clientErrorResponses);
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
          const informationalResponses = await knex
            .from('links')
            .whereIn('id', msg.data[0])
            .update({ status: 'informationalResponses' });

          console.log('Table updated', informationalResponses);

          const successfulResponses = await knex
            .from('links')
            .whereIn('id', msg.data[1])
            .update({ status: 'successfulResponses' });

          console.log('Table updated', successfulResponses);

          const redirectionMessages = await knex
            .from('links')
            .whereIn('id', msg.data[2])
            .update({ status: 'redirectionMessages' });

          console.log('Table updated', redirectionMessages);

          const clientErrorResponses = await knex
            .from('links')
            .whereIn('id', msg.data[3])
            .update({ status: 'clientErrorResponses' });

          console.log('Table updated', clientErrorResponses);
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
  app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}`);
});
}

isPrimary();