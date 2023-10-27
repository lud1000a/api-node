const { Model, DataTypes } = require('sequelize');

class Comment extends Model {
    static init(sequelize) {
        super.init({
            comment: DataTypes.STRING,
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Task, { foreignKey: 'task_id', as: 'tesk' });
    }
}

module.exports = Comment;