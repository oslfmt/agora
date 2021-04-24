const cors = require('cors');
const agorum = require('../controllers').agorum;
const course = require('../controllers').course;
const proposal = require('../controllers').courseproposal;
const contribution = require('../controllers').contribution;
const section = require('../controllers').coursesection;
const forum = require('../controllers').forum;
const forumpost = require('../controllers').forumpost;
const comment = require('../controllers').postcomment;
const user = require('../controllers').user;

module.exports = (app) => {
  app.use(cors());

  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Agorum API!',
  }));

  app.post('/api/agorum', agorum.create);
  app.get('/api/agorum', agorum.list);
  app.get('/api/agorum/:agorumId', agorum.retrieve)
  app.get('/api/agorum/lookup/:name', agorum.lookup)
  app.delete('/api/agorum/:agorumId', agorum.destroy)

  app.post('/api/agorum/:agorumId/course', course.create);
  app.get('/api/course', course.list);
  app.get('/api/course/:courseId', course.retrieve);
  app.get('/api/course/:name', course.lookup);
  app.delete('/api/agorum/:agorumId/course/:courseId', course.destroy);

  app.post('/api/proposal', proposal.create);
  app.get('/api/proposal', proposal.list);
  app.get('/api/proposal/:proposalId', proposal.retrieve);
  app.put('/api/proposal/:proposalId', proposal.update);
  app.delete('/api/proposal/:proposalId', proposal.destroy);

  app.post('/api/course/:courseId/contribution', contribution.create);
  app.get('/api/contribution', contribution.list);
  app.get('/api/contribution/:contributionId', contribution.retrieve);
  app.delete('api/contribution/:contributionId', contribution.destroy);

  app.post('/api/course/:courseId/section', section.create);
  app.get('/api/course/:courseId/section', section.list);
  // app.get('/api/course/:courseId/section/:sectionId', section.retrieve);
  app.get('/api/section/:sectionId', section.retrieve);
  app.put('/api/section/:sectionId', section.update);
  app.delete('/api/course/:courseId/section/:sectionId', section.destroy);

  app.post('/api/agorum/:agorumId/forum', forum.create);
  app.get('/api/forum', forum.list);
  app.get('/api/forum/:forumId', forum.retrieve);
  app.delete('/api/forum/:forumId', forum.destroy);

  app.post('/api/forum/:forumId/forumpost', forumpost.create);
  app.delete('/api/forumpost/:postId', forumpost.destroy);

  app.post('/api/forumpost/:postId/comment', comment.create);
  app.delete('/api/comment/:commentId', comment.destroy);

  app.post('/api/user', user.create);
  app.get('/api/user', user.list);
  app.get('/api/user/:userId', user.retrieve);
  app.put('/api/user/:userId', user.update);
  app.delete('/api/user/:userId', user.destroy);
};
