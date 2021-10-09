const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();
const crypto = require('crypto');
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();
var nodemailer = require('nodemailer');

var global = require('../env').get('prod');

const controllers = () => {

    const login = async (req) => {

        var password = req.body.senha;

        var ComandoSQL = await readCommandSql.retornaStringSql('login', 'login');
        var usuarioBanco = await db.Query(ComandoSQL, req.body);

        console.log('usuarioBanco', usuarioBanco)

        if (usuarioBanco != undefined && usuarioBanco.length > 0) {

            // valida se as senhas são diferentes
            var hashSenha = crypto.createHmac('sha256', password).digest('hex');

            console.log('hashSenha', hashSenha);
            console.log('usuarioBanco[0].Senha', usuarioBanco[0].senha)

            if (hashSenha.toLowerCase() != usuarioBanco[0].senha.toLowerCase()) {
                return {
                    status: 'error',
                    mensagem: "Usuário ou senha incorretos"
                };
            }

            console.log('usuario banco', usuarioBanco[0])

            // se estiver tudo ok, gera o token e retorna o json
            var tokenAcesso = Acesso.gerarTokenAcesso(usuarioBanco[0]);

            return {
                status: 'success',
                TokenAcesso: tokenAcesso,
                Nome: usuarioBanco[0].nome,
                Email: usuarioBanco[0].email,
                Avatar: usuarioBanco[0].avatar,
                GTK: undefined, // token do google
            };

        }
        else {
            return {
                status: 'error',
                mensagem: "Usuário ou senha incorretos" // "Usuário não cadastrado no sistema"
            };
        }
    };

    const cadastro = async (req) => {

        // valida se o email já está sendo utilizado
        var resultEmail = await validaEmail(req);
        console.log('resultEmail', resultEmail)

        req.body.idtipousuario = 2 // Fixo Usuário Normal

        if (resultEmail.length) {
            return {
                status: "error",
                mensagem: "O e-mail informado já está sendo utilizado"
            };
        }

        try {

            req.body.senha = crypto.createHmac('sha256', req.body.senha).digest('hex');

            var ComandoSQL = await readCommandSql.retornaStringSql('cadastro', 'login');
            await db.Query(ComandoSQL, req.body);

            console.log(ComandoSQL)

            return {
                status: "success",
                mensagem: "Usuário cadastrado com sucesso!"
            }

        }
        catch (ex) {
            return {
                status: "error",
                mensagem: 'Falha ao cadastrar usuário. Tente novamente',
                ex: ex
            }
        }

    }

    const alterarSenha = async (req) => {

        let _usuarioId = Acesso.retornaCodigoTokenAcesso('IdUsuario', req.headers['authorization']);
        req.body.idusuario = _usuarioId;

        // obtem os dados do usuario atual
        var ComandoSQL = await readCommandSql.retornaStringSql('usuarioPorId', 'login');
        var usuarioBanco = await db.Query(ComandoSQL, req.body);

        // valida se a senha atual é a mesma cadastrada
        // valida se as senhas são diferentes
        var hashSenha = crypto.createHmac('sha256', req.body.senha).digest('hex');

        console.log('hashSenha', hashSenha);
        console.log('usuarioBanco[0].Senha', usuarioBanco[0].senha)

        if (hashSenha.toLowerCase() != usuarioBanco[0].senha.toLowerCase()) {
            return {
                status: 'error',
                mensagem: "Senha atual incorreta!"
            };
        }

        // se tiver ok, salva a nova senha
        var novaSenha = crypto.createHmac('sha256', req.body.novaSenha).digest('hex');

        var ComandoSQLNovaSenha = await readCommandSql.retornaStringSql('alterarSenha', 'login');
        var usuarioBanco = await db.Query(ComandoSQLNovaSenha, { novaSenha: novaSenha, idusuario: _usuarioId });

        return {
            status: 'success',
            mensagem: "Senha alterada com sucesso!"
        };

    }

    const validaEmail = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('validaEmail', 'login');
        var result = await db.Query(ComandoSQL, req.body);

        console.log(result);
        return result

    }

    const emailRecuperarSenha = async (req) => {

        // valida se o email informado existe
        var ComandoSQL = await readCommandSql.retornaStringSql('login', 'login');
        var usuarioBanco = await db.Query(ComandoSQL, req.body);

        if (usuarioBanco != undefined && usuarioBanco.length > 0) {

            // cria uma nova senha
            var nova = Math.random() * (99999 - 10000) + 99999;
            var hashSenha = crypto.createHmac('sha256', nova).digest('hex');

            // salva a nova senha do usuário
            var ComandoSQLNovaSenha = await readCommandSql.retornaStringSql('alterarSenha', 'login');
            var usuarioBanco = await db.Query(ComandoSQLNovaSenha, { novaSenha: hashSenha, idusuario: usuarioBanco[0].idusuario });

            // envia o email
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: global.email
            });

            var mailOptions = {
                from: 'bebedourohistoriaememoria@gmail.com',
                to: req.body.email,
                subject: 'Bebedouro História e Memória - Recuperação de senha',
                html: `
            <table>
                <tbody>
                    <tr style="background:#000000">
                    <td align="left" class="sm-px-30" style="padding: 40px 48px 0px; text-align: left;"><img src="http://bebedourohistoriaememoria.com.br/assets/img/logo.png" style="margin: 0px; max-width: 100%; width: 161px;" width="161">
                        <table align="left" style="text-align: left;">
                        <tbody>
                            <tr>
                            <td></td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                    <tr>
                    <td class="sm-px-30" style="padding-top: 40px; padding-bottom: 24px;padding-left: 48px; padding-right: 48px;">
                        <h1 style="line-height: 40px; margin: 0px; font-size: 30px;">Recuperação de senha</h1>
                    </td>
                    </tr>
                    <tr></tr>
                    <tr>
                    <td class="sm-px-30" style="padding: 24px 48px;">
                        <p style="margin: 0; margin-bottom: 24px; font-size: 18px;">Olá, ${usuarioBanco[0].nome}</p>
                        <p style="margin: 0; margin-bottom: 24px; font-size: 18px;">Criamos uma senha temporária para que você possa realizar o login em nosso site. Lembre-se de alterar a senha depois que logar.<br></p>
                    </td>
                    </tr>
                    <tr>
                    <td align="left" style="padding-bottom: 40px; text-align: left;">
                        <table align="center" cellpadding="0" cellspacing="0" style="margin-left: auto; margin-right: auto;">
                        <thead>
                            <tr>
                            <th bgcolor="#000000" class="hover-bg-gray-900" style="mso-padding-alt: 12px 48px; border-radius: 10px; padding-left: 20px; padding-right: 20px;background:#000000;"><p style="font-size: 16px; padding-top: 16px; padding-bottom: 16px;color: #ffffff; text-decoration: none; display: inline-block;" target="_blank">${nova}</p></th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
            </table>
            `
            }

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log('Falha ao enviar e-mail.')
                    return {
                        status: 'error',
                        mensagem: "Falha ao recuperar senha. Tente novamente mais tarde."
                    };
                } else {
                    console.log('Email enviado! ', info.response);

                    return {
                        status: 'success',
                        mensagem: "Enviamos a nova senha para seu e-mail."
                    };

                }
            });

        }
        else {
            return {
                status: 'error',
                mensagem: "Usuário não cadastrado no sistema"
            };
        }

    }

    return Object.create({
        login
        , cadastro
        , alterarSenha
        , emailRecuperarSenha
    })

}

module.exports = Object.assign({ controllers })