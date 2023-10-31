const { Model, DataTypes } = require('sequelize');

class Comment extends Model {
    static init(sequelize) {
        super.init({
            comment: DataTypes.STRING,
            user_id: DataTypes.INTEGER
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Task, { foreignKey: 'task_id', as: 'tesk' });
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'creator' });
    }
}

module.exports = Comment;