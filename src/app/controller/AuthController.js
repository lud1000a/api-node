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
            return res.json({message: "Erro"}).status(400);
        }

        const valid = await bcrypt.compare(password, user.password);
        if (valid === false) {
            return res.json({ message: "Incorrect Password" });
        } else {
            const jwtToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET, {
                expiresIn: 86400,
            });
            return res.json({ message: "Welcome!", token: jwtToken });
        }
    },

    async forgotPassword(req, res) {
        //recuperar senha 
        const { email } = req.body;

        const user = await User.findOne({ where: { email: email } });

        if (user) {
            //criar token
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
                return res.status(400).json({
                    message: "Erro"
                });
            } else {

                //mandar email
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
                    if (err) return res.status(400).json({
                        mensagem: "Erro: E-mail não enviado com sucesso!"
                    });
                });

                return res.json({
                    mensagem: "E-mail enviado com sucesso!"
                });
            }
        } else {
            return res.status(400).json({ message: "User not found" });
        }

    },

    async recoveryPassword(req, res) {
        //mudar password apos o bglh
        const user = await User.findOne({ where: { recovery_key: req.body.token } });

        if (req.body.token && req.body.newpassword && user) {
            //mudar task se houver um body
            user.password = req.body.newpassword;
            user.recovery_key = null;
            if (await user.save()) {
                return res.json().status(200);
            } else {
                return res.json({ message: "Erro 2" }).status(400);
            }
        } else {
            return res.json({ message: "Token not found" }).status(400);
        }
    },
}
