const Task = require('../models/Task');
const User = require('../models/User');

module.exports = {
    async index(req, res) {

        const user_id = req.userId;

        const { task_status } = req.params ;
        
        if(task_status === 0 || task_status === 1){

            const task = await Task.findAll({ where: { user_id: req.userId, status: task_status } });

            return res.status(200).json(task);

        }else{

            const user = await User.findByPk(user_id, {
                include: {
                    association: 'task',
                }
            });
    
            return res.status(200).json(user.task);
        }
    },

    async store(req, res) {
    
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

        return res.status(201).json({ message: "Successfully created"})
    },

    async update(req, res) {
       
        const user_id = req.userId;
        const { task_id } = req.params;

        const task = await Task.findOne({ where: { id: task_id, user_id: user_id } });

        if (req.body.task) {
           
            task.task = req.body.task;
            const save = await task.save();
            
            if(save){
                return res.status(201).json({message: 'Successfully updated'});
            }else{
                return res.status(404);
            }
            
        } else if(task) {

            if (task.status === false) {
                
                task.status = 1;
                await task.save();

                return res.status(201).json({message: 'Successfully updated'});
            } else {
                
                task.status = 0;
                await task.save();

                return res.status(201).json({message: 'Successfully updated'});
            }

        }
        
    },

    async delete(req, res) {
       
        const user_id = req.userId;
        const { task_id } = req.params;

        const task = await Task.findOne({ where: { id: task_id, user_id: user_id } });

        if(task){
            if (task.destroy()){
                return res.status(200).json({message: "Successfully delete"});
             } 
        }else {
           return res.status(400).json({erro: "Task not found"});
         }
        
    },
};