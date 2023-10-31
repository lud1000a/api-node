const Task = require('../models/Task');
const User = require('../models/User');

module.exports = {
    async index(req, res) {
        //listar tasks
        const user_id = req.userId;

        const { task_status } = req.params ;
        
        if(task_status === 0 || task_status === 1){
            const task = await Task.findAll({ where: { user_id: req.userId, status: task_status } });

            return res.json(task);
        }else{
            const user = await User.findByPk(user_id, {
                include: {
                    association: 'task',
                }
            });
    
            return res.json(user.task);
        }
    },

    async store(req, res) {
        //criar task
        const user_id = req.userId;

        const { task } = req.body;

        const status = 0;

        if (!task) {
            return res.status(400).json({ error: 'Task not found' });
        }

        const tasks = await Task.create({
            user_id,
            task,
            status
        });

        return res.json(tasks)
    },

    async update(req, res) {
        //maracar como feita
        const user_id = req.userId;
        const { task_id } = req.params;

        const task = await Task.findOne({ where: { id: task_id, user_id: user_id } });

        if (req.body.task) {
            //mudar task se houver um body
            task.task = req.body.task;
            const save = await task.save();

            return res.json().status(200);
        } else {

            if (task.status === false) {
                //mudar para feita
                task.status = 1;
                const save = await task.save();

                return res.json(/*save*/).status(200);
            } else {
                //mudar para não feita
                task.status = 0;
                const save = await task.save();

                return res.json(/*save*/).status(200);
            }
        }
    },

    async delete(req, res) {
        //deletar dados do usuario
        const user_id = req.userId;
        const { task_id } = req.params;

        const task = await Task.findOne({ where: { id: task_id, user_id: user_id } });
        if(task){
            if (task.destroy()) {
                return res.json().status(200);
            } else {
                return res.json().status(401);
            }
        }else {
            return res.json().status(400);
        }
        
    },
};