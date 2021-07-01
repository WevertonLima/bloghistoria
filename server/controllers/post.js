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

    const obterpostporid = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('obterpostporid', 'post');
        var result = await db.Query(ComandoSQL, req.params);

        return result

    }

    const obtercomentarios = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('obtercomentarios', 'post');
        var result = await db.Query(ComandoSQL, req.params);

        return result

    }

    const obtercurtidausuario = async (req) => {

        req.params.idusuario = 1; // TODO: Remover fixo

        var ComandoSQL = await readCommandSql.retornaStringSql('obtercurtidausuario', 'post');
        var result = await db.Query(ComandoSQL, req.params);

        return result

    }

    const obtertagspost = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('obtertagspost', 'post');
        var result = await db.Query(ComandoSQL, req.params);

        return result

    }


    return Object.create({
        obterposts
        , obterpostspopulares
        , obterpostporid
        , obtercomentarios
        , obtercurtidausuario
        , obtertagspost
    })

}

module.exports = Object.assign({ controllers })