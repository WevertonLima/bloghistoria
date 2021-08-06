var mysql = require('mysql2');

module.exports = class AcessoDados {

    async Query(SqlQuery, parametros) {

        try {

            var SqlQueryUp = SqlQuery;
            var retorno;
            var connection = mysql.createConnection(global.env.database);

            // percorre os parametros
            if (parametros) {
                let p = parametros;

                for (let key in p) {

                    if (p.hasOwnProperty(key)) {

                        let campo = key;
                        let valor = p[key];

                        //console.log('campo', campo)
                        //console.log('valor', valor)

                        // valida se é para forçar o tipo para String (str)
                        if (campo.indexOf('str') != 0) {

                            // valida se o valor é null
                            if (valor == 'null' || valor == null) {
                                SqlQueryUp = SqlQueryUp.replace('@' + campo, valor);
                            }
                            // valida se é número
                            else if (valor != '' && !isNaN(valor)) {
                                // valida se é float ou int
                                if (!Number.isInteger(parseFloat(valor))) // float
                                    SqlQueryUp = SqlQueryUp.replace('@' + campo, valor);
                                else // int
                                    SqlQueryUp = SqlQueryUp.replace('@' + campo, valor);
                            }
                            // valida se é data (yyyy-MM-dd)
                            else if (valor != '' && valor.split('-').length == 3 && valor.length == 10) //date
                                SqlQueryUp = SqlQueryUp.replace('@' + campo, `'${valor}'`);

                            else {
                                SqlQueryUp = SqlQueryUp.replace('@' + campo, `'${valor}'`);
                            }

                        }
                        else {

                            // valida se o valor é null
                            if (valor == 'null' || valor == null) {
                                SqlQueryUp = SqlQueryUp.replace('@' + campo.replace('str', ''), valor);
                            }
                            else {
                                SqlQueryUp = SqlQueryUp.replace('@' + campo.replace('str', ''), `'${valor}'`);
                            }
                        }

                    }
                }
            }

            //return SqlQueryUp;
            //console.log(SqlQueryUp);

            connection.connect();

            await new Promise((resolve, reject) => {

                connection.query(SqlQueryUp, function (error, results, fields) {
                    if (error) { reject(); throw error }
                    retorno = results
                    resolve()
                });

            })

            connection.end();
            //console.log('retorno', retorno)
            return retorno;

        } catch (error) {
            return error;
        }
    }

}