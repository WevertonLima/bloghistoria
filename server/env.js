var config = {
    dev: {
        url: 'http://localhost',
        port: 3000,
        ambiente: 'DEV',
        session: {
            secret: 'teste',
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false }
        },
        database: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'root',
            database: 'bloghistoria'
        },
        // email: {
        //     user: 'teste@gmail.com',
        //     pass: 'teste' 
        // },
        googleID: "467541054020-pvaandkfp21fto9fr1bg9pcoucsto99r.apps.googleusercontent.com",
        googleSecretKey: "LOlbFNPzTjGagC6apUUHOfmF",
        googleAPIKey: "AIzaSyAOhbuoACObvGqkDTMxsz7QCc8AwS_tafA"
    },
    prod: {
        url: 'http://bebedourohistoriaememoria.com.br/',
        //url: 'http://localhost',
        port: 80,
        ambiente: 'PROD',
        session: {
            secret: 'teste',
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false }
        },
        database: {
            host: '185.211.7.154',
            port: 3306,
            user: 'u975003274_bloghistoria',
            password: 'Bl0gh1st0r1@',
            database: 'u975003274_bloghistoria'
        },
        email: {
            user: 'bebedourohistoriaememoria@gmail.com',
            pass: '03maio1884' 
        },
        googleID: "467541054020-pvaandkfp21fto9fr1bg9pcoucsto99r.apps.googleusercontent.com",
        googleSecretKey: "LOlbFNPzTjGagC6apUUHOfmF",
        googleAPIKey: "AIzaSyAOhbuoACObvGqkDTMxsz7QCc8AwS_tafA"
    }

}

exports.get = function get(env) {

    if(env.toLowerCase() == "dev")
        return config.dev;

    if(env.toLowerCase() == "prod")
        return config.prod;
        
}