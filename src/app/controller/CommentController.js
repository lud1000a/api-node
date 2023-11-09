const Task = require('../models/Task');
const Comment = require('../models/Comment');

module.exports = {
    async index(req, res) {
        
        const { task_id } = req.params;

        if(task_id !== "-"){

            const task = await Task.findByPk(task_id, {
                include: {
                    association: 'comment',
                }
            });
    
            if(!task){
                return res.status(400).json({erro: "Task not found!"});
            }
    
            return res.status(200).json(task.comment);

        }else{
            
            return res.status(200).json(await Task.findAll({
                include:[{
                    model: Comment,
                    as: 'comment'
                }]
            }));
        }
       
    },

    async store(req, res) {

        const { task_id } = req.params;
        
        const user_id = req.userId;

        const comment = req.body.comment;

        const task = await Task.findByPk(task_id);

        if (!task) {

            return res.status(400).json({ error: 'Task not found' });
        }

        const comments = await Comment.create({
            task_id,
            user_id,
            comment
        });

        return res.status(201).json({ message: "Successfully created"})
    },

    async update(req, res) {
        //alterar comentario
        const { id } = req.params;

        const comment = await Comment.findOne({ where: { id: id}});

        if(req.body  && comment){

            comment.comment = req.body.comment;
            const save = await comment.save();

            if(save){
                return res.status(201).json({ message: "Successfully updated"}); 
            }else{
                return res.status(404).json(); 
            }

        }else{
            return res.status(401).json({ erro: "Invalid credentials"}); 
        }
        
    },

    async delete(req, res) {
        //deletar comentario
        const { id } = req.params;

        const comment = await Comment.findOne({ where: { id: id}});
        
        if(comment){

            if (comment.destroy()) {
                return res.json().status(200);
            } else {
                return res.status(404);
            }

        }else {
            return res.status(400).json({ erro: "Invalid credentials"});
        }
        
    },
};