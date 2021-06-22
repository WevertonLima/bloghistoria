const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    const consultar = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('consultar', 'BOsobre');
        var result = await db.Query(ComandoSQL);

        return result

    }

    const atualizar = async (req) => {

        try {

            var ComandoSQL = await readCommandSql.retornaStringSql('atualizar', 'BOsobre');
            var result = await db.Query(ComandoSQL, req.body);

            return {
                resultado: "sucesso",
                msg: "Dados atualizados com sucesso!"
            }

        } catch (error) {
            return {
                resultado: "erro",
                msg: "Falha ao realizar operação. Tente novamente.",
                ex: error
            }
        }

    }

    return Object.create({
        consultar
        , atualizar
    })

}

module.exports = Object.assign({ controllers })