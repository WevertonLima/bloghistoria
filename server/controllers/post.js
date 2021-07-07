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

        let _usuarioId = 0
        req.params.idusuario = _usuarioId;

        let _tipoUsuarioId = 0;
        req.params.idtipousuario = _tipoUsuarioId;

        try {
            _usuarioId = Acesso.retornaCodigoTokenAcesso('IdUsuario', req.headers['authorization']);
            req.params.idusuario = _usuarioId;

            _tipoUsuarioId = Acesso.retornaCodigoTokenAcesso('IdTipoUsuario', req.headers['authorization']);
            req.params.idtipousuario = _tipoUsuarioId;

        }
        catch {

        }

        console.log('_usuarioId', _usuarioId);
        console.log('_tipoUsuarioId', _tipoUsuarioId);

        var ComandoSQL = await readCommandSql.retornaStringSql('obtercomentarios', 'post');
        var result = await db.Query(ComandoSQL, req.params);

        return result

    }

    const obtercurtidausuario = async (req) => {

        let _usuarioId = Acesso.retornaCodigoTokenAcesso('IdUsuario', req.headers['authorization']);
        req.params.idusuario = _usuarioId;

        console.log('_usuarioId', _usuarioId)

        var ComandoSQL = await readCommandSql.retornaStringSql('obtercurtidausuario', 'post');
        var result = await db.Query(ComandoSQL, req.params);

        return result

    }

    const obtertagspost = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('obtertagspost', 'post');
        var result = await db.Query(ComandoSQL, req.params);

        return result

    }

    const curtir = async (req) => {

        var result;

        let _usuarioId = Acesso.retornaCodigoTokenAcesso('IdUsuario', req.headers['authorization']);
        req.body.idusuario = _usuarioId;

        if (req.body.curtir == 1) {

            // curtir
            var ComandoSQL = await readCommandSql.retornaStringSql('curtir', 'post');
            result = await db.Query(ComandoSQL, req.body);

        }
        else if (req.body.curtir == 0) {

            // descurtir
            var ComandoSQL = await readCommandSql.retornaStringSql('descurtir', 'post');
            result = await db.Query(ComandoSQL, req.body);

        }
        
        return result

    }

    const acesso = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('acesso', 'post');
        var result = await db.Query(ComandoSQL, req.body);

        return result

    }

    const removerComentario = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('removerComentario', 'post');
        var result = await db.Query(ComandoSQL, req.body);

        return result

    }

    const adicionarComentario = async (req) => {

        let _usuarioId = Acesso.retornaCodigoTokenAcesso('IdUsuario', req.headers['authorization']);
        req.body.idusuario = _usuarioId;

        var ComandoSQL = await readCommandSql.retornaStringSql('adicionarComentario', 'post');
        var result = await db.Query(ComandoSQL, req.body);

        return result

    }


    return Object.create({
        obterposts
        , obterpostspopulares
        , obterpostporid
        , obtercomentarios
        , obtercurtidausuario
        , obtertagspost
        , curtir
        , acesso
        , removerComentario
        , adicionarComentario
    })

}

module.exports = Object.assign({ controllers })