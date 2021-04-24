const CourseSection = require('../models').CourseSection;

module.exports = {
  create(req, res) {
    return CourseSection
      .create({
        content: req.body.content,
        courseId: req.params.courseId,
      })
      .then(section => res.status(201).send(section))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return CourseSection
      .findAll()
      .then(CourseSection => res.status(200).send(CourseSection))
      .catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    return CourseSection
      .findByPk(req.params.sectionId)
      .then(CourseSection => {
        if (!CourseSection) {
          return res.status(404).send({
            message: 'CourseSection Not Found',
          });
        }
        return res.status(200).send(CourseSection);
      })
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return CourseSection
      .findByPk(req.params.sectionId)
      .then(CourseSection => {
        if (!CourseSection) {
          return res.status(404).send({
            message: 'UserID Not Found',
          });
        }
        return CourseSection
          .update({
            content: req.body.content || CourseSection.content,
          })
          .then(CourseSection => res.status(200).send(CourseSection))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
  destroy(req, res) {
    return CourseSection
      .findByPk(req.params.sectionId)
      .then(CourseSection => {
        if (!CourseSection) {
          return res.status(400).send({
            message: 'CourseSection Not Found',
          });
        }
        return CourseSection
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};