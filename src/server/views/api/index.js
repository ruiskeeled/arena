const router = require('express').Router();

const jobRetry = require('./jobRetry');
const jobRemove = require('./jobRemove');
const jobPromote = require('./jobPromote');
const bulkJobsRemove = require('./bulkJobsRemove');
const bulkJobsRetry = require('./bulkJobsRetry');

router.post('/queue/:queueHost/:queueName/job/bulk', bulkJobsRemove);
router.patch('/queue/:queueHost/:queueName/job/bulk', bulkJobsRetry);
router.patch('/queue/:queueHost/:queueName/job/:id', jobRetry);
router.delete('/queue/:queueHost/:queueName/job/:id', jobRemove);
router.patch('/queue/:queueHost/:queueName/job/:id/promote', jobPromote);

module.exports = router;
