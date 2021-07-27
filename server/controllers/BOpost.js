const AcessoDados = require('../db/acessodados.js');
const db = new AcessoDados();
const UsuarioTokenAcesso = require('../common/protecaoAcesso');
const Acesso = new UsuarioTokenAcesso();
const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const fs = require('fs');
var path = require('path');


const controllers = () => {

    const consultar = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('consultar', 'BOpost');
        var result = await db.Query(ComandoSQL);

        return result

    }



    // usar para Galeria
    const adicionarImagem = async (req) => {

        var baseImage = req.body.base64Image;

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
            console.log('base64Data', base64Data)

            return { filename, localPath };

        } catch (error) {
            return { error: error };
        }

    }

    const adicionar = async (req) => {

        var ComandoSQL = await readCommandSql.retornaStringSql('adicionar', 'BOpost');
        var result = await db.Query(ComandoSQL);

        return result

    }

    return Object.create({
        consultar
    })

}

module.exports = Object.assign({ controllers })