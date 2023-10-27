const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = {
    async store(req, res) {
        //salvar novo usuario
        const { name, email, password } = req.body;

        const emailValidation = await User.findOne({ where: { email: email } });

        if (emailValidation === null) {
            if(req.body !== null){
                const user = await User.create({ name, email, password });

                return res.json(user);
            }else{
                return res.status(401).json({ message: "Erro" });
            }
        } else {
            return res.status(401).json({ message: "Erro" });
        }

    },

    async show(req, res) {
        //mostrar dados do usuario
        const user = await User.findOne({ where: { id: req.userId } });

        return res.json({
            name: user.name,
            email: user.email
        });
    },

    async update(req, res) {
        //atualizar dados do usuario 
        const user = await User.findOne({ where: { id: req.userId } });

        if (req.body.name) {
            //mudar task se houver um body
            user.name = req.body.name;
            const save = await user.save();

            return res.json({
                name: user.name,
                email: user.email
            }).status(200);

        } else {
            return res.json({ message: "Erro" }).status(401);
        }
    },

    async updatePassword(req, res) {
        //atualizar dados do usuario 
        const user = await User.findOne({ where: { id: req.userId } });
;
        if (req.body.password && req.body.newpassword) {
            const valid = await bcrypt.compare(req.body.password, user.password);
            if(valid === false){
                return res.json({ message: "Incorrect password" }).status(401);
            } else {
                user.password = req.body.newpassword;
                const save = await user.save();
                return res.json().status(200);
            }
        } else {
            return res.json({ message: "Erro" }).status(401);
        }
    },


    async delete(req, res) {
        //deletar dados do usuario
        const user = await User.findOne({ where: { id: req.userId } });

        if (user) {
            if (user.destroy()) {
                return res.json().status(200);
            } else {
                return res.json().status(401);
            }
        } else {
            return res.status(400).json({ message: "Erro" });
        }
    },
};