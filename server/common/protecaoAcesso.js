var jwt = require('jsonwebtoken');
var SchemaObject = require('node-schema-object');

var UsuarioTokenAcesso = new SchemaObject({ tokenAcesso: String },
    {
        methods: {

            gerarTokenAcesso(dados) {
                return jwt.sign({ 'Email': dados.email, 'IdUsuario': dados.idusuario, 'Nome': dados.nome, 'IdTipoUsuario': dados.idtipousuario }, 'Token', { expiresIn: 36000 });
            },

            verificaTokenAcesso(req, res, next) {
                var headerTokenAcesso = req.headers['authorization'];
                if (typeof headerTokenAcesso != 'undefined') {
                    try {
                        var decoded = jwt.verify(headerTokenAcesso, 'Token');
                        next();
                    } catch (err) {
                        res.send(401);
                    }
                } else {
                    res.send(401);
                }
            },

            retornaCodigoTokenAcesso(Valor, req) {
                var headerTokenAcesso = req;
                var decoded = jwt.decode(headerTokenAcesso, { complete: true });

                console.log(decoded.payload);

                if (Valor === "Email") {
                    return decoded.payload.Email;
                }
                else if (Valor === "IdUsuario") {
                    return decoded.payload.IdUsuario;
                }
                else if (Valor === "IdTipoUsuario") {
                    return decoded.payload.IdTipoUsuario;
                }
            }
        }
    }
);

module.exports = UsuarioTokenAcesso;