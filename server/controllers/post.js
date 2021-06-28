const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    const obterposts = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('obterposts', 'post');
        var result = await db.Query(ComandoSQL);

        return result

    }

    const obterpostspopulares = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('obterpostspopulares', 'post');
        var result = await db.Query(ComandoSQL);

        return result

    }


    return Object.create({
        obterposts
        , obterpostspopulares
    })

}

module.exports = Object.assign({ controllers })