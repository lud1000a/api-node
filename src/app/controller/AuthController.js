const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports = {
    
    async login(req, res) {
        //logar
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });

        if (user === null) {

            return res.status(400).json({ erro: "Incorrect credentials" });

        }else{
            const valid = await bcrypt.compare(password, user.password);

            if (valid === false) {

                return res.status(400).json({ erro: "Incorrect credentials" });

            } else {

                const jwtToken = jwt.sign(
                    { id: user.id, email: user.email },
                    process.env.JWT_SECRET, {
                    expiresIn: 86400,
                });

                if(jwtToken){
                    
                    return res.status(200).json({ message: "Welcome!", token: jwtToken });
                }

                return res.status(404).json({ erro: "Token not found"})
                
            }
        }
    },

    async forgotPassword(req, res) {
        //recuperar senha 
        const { email } = req.body;

        const user = await User.findOne({ where: { email: email } });

        if (user) {
            
            const token = crypto.randomBytes(10).toString('hex');
            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByPk(user.id, {
                '$set': {
                    recovery_key: token,
                    recovery_key_at: now
                }
            });

            //Salvando no bd
            user.recovery_key = token;
            user.recovery_key_at = now;
            const save = await user.save();

            if (!save) {

                return res.status(502).json({ erro: "Token not save"});

            } else {

                var transport = nodemailer.createTransport({
                    host: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                        user: "534bc295b641a6",
                        pass: "cb13978ead3016"
                    }
                });

                var message = {
                    from: "todos@gmail.com",
                    to: user.email,
                    subject: "Instrução para recuperar a senha",
                    text: "\n\n",
                    html: "Prezado(a) " + user.name + ". <br><br>Insira o token para recuperar a senha: " + token + " <br><br>"
                };

                transport.sendMail(message, function (err) {
                    if (err) return res.status(400).json({ erro: "E-mail not sent" });
                });

                return res.status(200).json({ mensagem: "E-mail sent with success" });

            }
        } else {

            return res.status(400).json({ erro: "Incorrect credentials" });

        }
    },

    async recoveryPassword(req, res) {
        //mudar password apos o bglh
        const user = await User.findOne({ where: { recovery_key: req.body.token } });

        if (req.body.token && req.body.newpassword && user) {
            
            user.password = req.body.newpassword;
            user.recovery_key = null;

            if (await user.save()) {

                return res.status(200).json({ message: "Success"});

            } else {

                return res.status(400).json({ erro: "Credentials not updated" });

            }
        } else {

            return res.status(400).json({ erro: "Token not found" });

        }
    },

}
