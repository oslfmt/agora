const Course = require('../models').Course;
const CourseSection = require('../models').CourseSection;

module.exports = {
  create(req, res) {
    return Course
      .create({
        name: req.body.name,
        agorumId: req.params.agorumId,
      })
      .then(course => res.status(201).send(course))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return Course
      .findAll({
        include: [{
          model: CourseSection,
          as: 'coursesections',
        }],
      })
      .then(course => res.status(200).send(course))
      .catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    return Course
      .findByPk(req.params.courseId, {
        include: [{
          model: CourseSection,
          as: 'coursesections',
        }]
      })
      .then(Course => {
        if (!Course) {
          return res.status(404).send({
            message: 'Course Not Found',
          });
        }
        return res.status(200).send(Course);
      })
      .catch(error => res.status(400).send(error));
  },
  lookup(req, res) {
    return Course
      .findAll({
        where: {
          name: req.params.name
        }
      })
      .then(Course => {
        if (!Course) {
          return res.status(404).send({
            message: 'Course Not Found',
          });
        }
        return res.status(200).send(Course);
      })
      .catch(error => res.status(400).send(error));
  },
  destroy(req, res) {
    return Course
      .findByPk(req.params.courseId)
      .then(Course => {
        if (!Course) {
          return res.status(400).send({
            message: 'Course Not Found',
          });
        }
        return Course
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};