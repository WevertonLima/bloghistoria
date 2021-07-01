const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    const adicionar = async (req) => {

        // valida se ja nao existe o e-mail informado

        var ComandoSQL = await readCommandSql.retornaStringSql('consultar', 'email');
        var _existe = await db.Query(ComandoSQL, req.body);

        if (_existe != undefined && _existe.length > 0) {
            return {
                status: 'error',
                mensagem: "E-mail já cadastrado"
            };
        }
        else {
            var ComandoSQL = await readCommandSql.retornaStringSql('adicionar', 'email');
            var result = await db.Query(ComandoSQL, req.body);

            return {
                status: 'success',
                mensagem: "E-mail cadastrado com sucesso!"
            };
        }

    }


    return Object.create({
        adicionar
    })

}

module.exports = Object.assign({ controllers })