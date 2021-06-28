const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    const obtercategoriasdestaques = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('obtercategoriasdestaques', 'common');
        var result = await db.Query(ComandoSQL);

        return result

    }


    const obtercategorias = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('obtercategorias', 'common');
        var result = await db.Query(ComandoSQL);

        return result

    }

    const obtertags = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('obtertags', 'common');
        var result = await db.Query(ComandoSQL);

        return result

    }

    const obtersobre = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('obtersobre', 'common');
        var result = await db.Query(ComandoSQL);

        return result

    }


    return Object.create({
        obtercategoriasdestaques
        , obtercategorias
        , obtertags
        , obtersobre
    })

}

module.exports = Object.assign({ controllers })