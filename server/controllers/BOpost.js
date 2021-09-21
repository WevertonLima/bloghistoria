const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const fs = require('fs');
var path = require('path');
const { resolve } = require('path');


const controllers = () => {

    const consultar = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('consultar', 'BOpost');
        var result = await db.Query(ComandoSQL);

        return result

    }

    const obterPorId = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('obterPorId', 'BOpost');
        var result = await db.Query(ComandoSQL, req.params);

        return result

    }

    const inserir = async (req) => {

        try {

            //console.log('INSERIR')
            //console.log(req.body);

            let _usuarioId = Acesso.retornaCodigoTokenAcesso('IdUsuario', req.headers['authorization']);
            req.body.idusuario = _usuarioId

            var ComandoSQL = await readCommandSql.retornaStringSql('inserir', 'BOpost');
            var result = await db.Query(ComandoSQL, req.body);

            return {
                resultado: "sucesso",
                msg: "Publicação cadastrada com sucesso!"
            }

        } catch (error) {
            return {
                resultado: "erro",
                msg: "Falha ao realizar operação. Tente novamente.",
                ex: error
            }
        }

    }

    const atualizar = async (req) => {

        try {

            // Salva as informações principais e a categoria

            var ComandoSQL = await readCommandSql.retornaStringSql('atualizar', 'BOpost');
            var result = await db.Query(ComandoSQL, {
                titulo: req.body.strtitulo,
                descricao: req.body.strdescricao,
                capa: req.body.strcapa,
                conteudo: req.body.conteudo,
                idcategoria: req.body.idcategoria,
                idnoticia: req.body.idnoticia
            });

            // limpa as Tags da publicação

            var ComandoSQLTags = await readCommandSql.retornaStringSql('removerTags', 'BOtag');
            await db.Query(ComandoSQLTags, { idnoticia: req.body.idnoticia });
            //console.log('ComandoSQLTags', ComandoSQLTags)

            // cadastra as novas Tags

            if (req.body.listaTags.length > 0) {

                var promessas = [];

                req.body.listaTags.forEach(function (tag) {
                    promessas.push(
                        new Promise(async (resolve, reject) => {

                            //console.log('req.body.idnoticia', req.body.idnoticia);
                            //console.log('idtag', tag);

                            var ComandoSQLAdd = await readCommandSql.retornaStringSql('adicionarTagNoticia', 'BOtag');
                            await db.Query(ComandoSQLAdd, { idnoticia: req.body.idnoticia, idtag: tag });

                            resolve();
                        })
                    );
                });

                await Promise.all(promessas);

            }

            return {
                resultado: "sucesso",
                msg: "Publicação atualizada com sucesso!"
            }

        } catch (error) {
            return {
                resultado: "erro",
                msg: "Falha ao realizar operação. Tente novamente.",
                ex: error
            }
        }

    }

    const atualizarStatus = async (req) => {

        try {

            var ComandoSQL = await readCommandSql.retornaStringSql('atualizarStatus', 'BOpost');
            var result = await db.Query(ComandoSQL, req.body);

            return {
                resultado: "sucesso",
                msg: "Status atualizado com sucesso!"
            }

        } catch (error) {
            return {
                resultado: "erro",
                msg: "Falha ao realizar operação. Tente novamente.",
                ex: error
            }
        }

    }


    // usar para Galeria
    const adicionarImagem = async (base64Image) => {

        var baseImage = base64Image;

        //console.log('baseImage', baseImage);

        try {

            var appDir = path.dirname(require.main.filename);

            /*path of the folder where your project is saved. (In my case i got it from config file, root path of project).*/
            const uploadPath = appDir + "/server/";

            //path of folder where you want to save the image.
            const localPath = `${uploadPath}/public/capas/`;

            //Find extension of file
            const ext = baseImage.substring(baseImage.indexOf("/") + 1, baseImage.indexOf(";base64"));
            const fileType = baseImage.substring("data:".length, baseImage.indexOf("/"));

            //Forming regex to extract base64 data of file.
            const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');

            //Extract base64 data.
            const base64Data = baseImage.replace(regex, "");
            const rand = Math.ceil(Math.random() * 1000);

            //Random photo name with timeStamp so it will not overide previous images.
            const GUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            })

            console.log('GUID', GUID);
            const filename = `${GUID}.${ext}`;

            //Check that if directory is present or not.
            if (!fs.existsSync(`${uploadPath}/public/`)) {
                fs.mkdirSync(`${uploadPath}/public/`);
            }
            if (!fs.existsSync(localPath)) {
                fs.mkdirSync(localPath);
            }

            console.log('filename', filename);

            fs.writeFileSync(localPath + filename, base64Data, 'base64');

            console.log('localPath + filename', localPath + filename)
            //console.log('base64Data', base64Data)

            return { filename, localPath };

        } catch (error) {
            return { error: error };
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