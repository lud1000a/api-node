const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt'); 


class User extends Model {
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
        }, {
            sequelize
        })
    
        User.beforeCreate(async (user) => {
            if (user.password) {
              const salt = await bcrypt.genSaltSync(10, "a");
              user.password = bcrypt.hashSync(user.password, salt);
            }
          });
          
        User.beforeUpdate(async (user) => {
            if (user.password) {
              const salt = await bcrypt.genSaltSync(10, "a");
              user.password = bcrypt.hashSync(user.password, salt);
            }
          });
    
    }
    static associate(models){
        this.hasMany(models.Task, { foreignKey: 'user_id', as: 'task'});
    }
}

module.exports = User;