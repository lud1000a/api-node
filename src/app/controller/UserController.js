const User = require('../models/User');

module.exports = {

    async store(req, res) {
       
        const { name, email, password } = req.body;
        
        const emailValidation = await User.findOne({ where: { email: email } });

        if (emailValidation === null) {

            if(password !== "" && email !== "" && password !== ""){
                const user = await User.create({ name, email, password });

                return res.status(201).json({ message: "Successfully created"});

            }else{
                return res.status(400).json({ erro: "Invalid credentials"}); 
            }

        } else {
            return res.status(400).json({ erro: "Invalid credentials 2"}); 
        }

    },

    async show(req, res) {
      
        const user = await User.findOne({ where: { id: req.userId } });

        return res.status(200).json({
            name: user.name,
            email: user.email
        });
    },

    async update(req, res) {
        
        const user = await User.findOne({ where: { id: req.userId } });

        if (req.body.name) {

            user.name = req.body.name;
            const save = await user.save();

            return res.status(201).json({ message: "Successfully updated"});

        } else {
            return res.status(400).json({ erro: "Invalid credentials"}); 
        }
    },

    async updatePassword(req, res) {
        
        const user = await User.findOne({ where: { id: req.userId } });
;
        if (req.body) {
            
            user.password = req.body.newpassword;
            const save = await user.save();

            if(save){
                return res.status(201).json({ message: "Successfully updated"})
            }
        } else {
            return res.status(400).json({ erro: "Invalid credentials"}); 
        }
    },


    async delete(req, res) {
        //deletar dados do usuario
        const user = await User.findOne({ where: { id: req.userId } });

        if (user) {
            if (user.destroy()) {
                return res.status(200).json({ message: "Successfully "});
            } else {
                return res.status(404);
            }
        } else {
            return res.status(400).json({ erro: "Invalid credentials"}); 
        }
    },
};