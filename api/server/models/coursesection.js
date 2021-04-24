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
      });
    }
  };
  CourseSection.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    number: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'CourseSection',
  });
  return CourseSection;
};