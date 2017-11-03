const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');

const loadConfigFromEnv = () => {
  "use strict";
  const queues = [];

  if (process.env.REDIS_URL && process.env.QUEUES) {
    const queusList = process.env.QUEUES.split(',');

    queusList.forEach(queue => {
      queues.push({name: queue, url: process.env.REDIS_URL, hostId: "skeeled"});
      console.log(`Loaded queues: ${queue}`);
    });
  }

  return queues;
};

module.exports = function() {
  const hbs = exphbs.create({
    defaultLayout: `${__dirname}/views/layout`,
    handlebars,
    partialsDir: `${__dirname}/views/partials/`,
    extname: 'hbs'
  });

  require('handlebars-helpers')({handlebars});
  require('./views/helpers/handlebars')(handlebars);

  const app = express();

  const enviromentConfig = loadConfigFromEnv();
  const defaultConfig = require(path.join(__dirname, 'config', 'index.json'));

  defaultConfig.queues = enviromentConfig.length > 0 ? enviromentConfig : defaultConfig.queues;

  const Queues = require('./queue');
  app.locals.Queues = new Queues(defaultConfig);
  app.locals.basePath = '';

  app.set('views', `${__dirname}/views`);
  app.set('view engine', 'hbs');
  app.set('json spaces', 2);

  app.engine('hbs', hbs.engine);

  app.use(bodyParser.json());

  return {
    app,
    Queues: app.locals.Queues
  };
};
