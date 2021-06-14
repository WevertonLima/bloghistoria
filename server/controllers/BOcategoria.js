const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const controllers = () => {

    const consultar = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('consultar', 'BOcategoria');
        var result = await db.Query(ComandoSQL);

        return result

    }

     const obterPorId = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('obterPorId', 'BOcategoria');
        var result = await db.Query(ComandoSQL, req.params);

        return result

    }

    const inserir = async (req) => {

        try {
            
            var ComandoSQL = await readCommandSql.retornaStringSql('inserir', 'BOcategoria');
            var result = await db.Query(ComandoSQL, req.body);

            return { 
                resultado : "sucesso", 
                msg: "Categoria inserida com sucesso!" 
            }

        } catch (error) {
            return { 
                resultado : "erro", 
                msg: "Falha ao realizar operação. Tente novamente.",
                ex: error
            }
        }

    }

    const atualizar = async (req) => {

        try {
            
            var ComandoSQL = await readCommandSql.retornaStringSql('atualizar', 'BOcategoria');
            var result = await db.Query(ComandoSQL, req.body);

            return { 
                resultado : "sucesso", 
                msg: "Categoria atualizada com sucesso!" 
            }

        } catch (error) {
            return { 
                resultado : "erro", 
                msg: "Falha ao realizar operação. Tente novamente.",
                ex: error
            }
        }

    }

    const atualizarStatus = async (req) => {

        try {
            
            var ComandoSQL = await readCommandSql.retornaStringSql('atualizarStatus', 'BOcategoria');
            var result = await db.Query(ComandoSQL, req.body);

            return { 
                resultado : "sucesso", 
                msg: "Status atualizado com sucesso!" 
            }

        } catch (error) {
            return { 
                resultado : "erro", 
                msg: "Falha ao realizar operação. Tente novamente.",
                ex: error
            }
        }

    }

    return Object.create({
        consultar
        , obterPorId
        , inserir
        , atualizar
        , atualizarStatus
    })

}

module.exports = Object.assign({ controllers })