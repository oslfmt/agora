'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CourseSection extends Model {
    static associate(models) {
      CourseSection.belongsTo(models.Course, {
        foreignKey: 'courseId',
        onDelete: 'CASCADE',
      })
    }
  };
  CourseSection.init({
    number: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CourseSection',
  });
  return CourseSection;
};