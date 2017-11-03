const _ = require('lodash');
const util = require('util');

async function handler(req, res) {

  const { queueName, queueHost, id } = req.params;
  const { json } = req.query;

  const {Queues} = req.app.locals;
  const queue = await Queues.get(queueName, queueHost);
  if (!queue) return res.status(404).render('dashboard/templates/queueNotFound', {queueName, queueHost});

  const job = await queue.getJob(id);
  if (!job) return res.status(404).render('dashboard/templates/jobNotFound', {id, queueName, queueHost});

  if (json === 'true') {
    delete job.queue; // avoid circular references parsing error
    return res.json(job);
  }

  let jobState;
  if (queue.IS_BEE) {
    jobState = job.status;
  } else {
    jobState = await job.getState();
  }

  if (job.delay) {
    job.runAt = job.timestamp + job.delay;
  }

  return res.render('dashboard/templates/jobDetails', {
    queueName,
    queueHost,
    jobState,
    job
  });
}

module.exports = handler;
