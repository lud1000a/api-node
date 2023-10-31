const Task = require('../models/Task');
const Comment = require('../models/Comment');

module.exports = {
    async index(req, res) {
        //listar comentarios da task
        const { task_id } = req.params;
        
        if(task_id !== "-"){
            const task = await Task.findByPk(task_id, {
                include: {
                    association: 'comment',
                }
            });
    
            if(!task){
                return res.json({message: "Task not found!"});
            }
    
            return res.json(task.comment);
        }else{
            
            return res.json(await Task.findAll({
                include:[{
                    model: Comment,
                    as: 'comment'
                }]
            }));
        }
       
    },

    async store(req, res) {
        //criar comentario
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

        return res.json(comments)
    },

    async update(req, res) {
        //alterar comentario
        const { id } = req.params;

        const comment = await Comment.findOne({ where: { id: id}});

        if(req.body  && comment){
            comment.comment = req.body.comment;
            const save = await comment.save();

            return res.json().status(200); 
        }else{
            return res.json({message: "Erro"}).status(401); 
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
                return res.json({message: "Erro"}).status(401);
            }
        }else {
            return res.json({message: "Nonexiste"}).status(400);
        }
        
    },
};