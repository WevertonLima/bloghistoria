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
        // googleID: "629679185123-d8q71lomop2gukdgtqp2klb3atujmlnd.apps.googleusercontent.com",
        // googleSecretKey: "QSAUjcDpxbGP2IIB8KlWlJww"
    },
    prod: {
        url: 'http://www.ajeitameulayout.com.br/',
        port: 21107,
        ambiente: 'PROD',
        session: {
            secret: 'teste',
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false }
        },
        database: {
            host: 'mysql26-farm36.kinghost.net',
            port: 3306,
            user: 'ajeitameulayou',
            password: 'bl0gh1st0r1a',
            database: 'ajeitameulayou'
        },
        // email: {
        //     user: 'teste@gmail.com',
        //     pass: 'teste' 
        // },
        // googleID: "629679185123-d8q71lomop2gukdgtqp2klb3atujmlnd.apps.googleusercontent.com",
        // googleSecretKey: "QSAUjcDpxbGP2IIB8KlWlJww"
    }

}

exports.get = function get(env) {

    if(env.toLowerCase() == "dev")
        return config.dev;

    if(env.toLowerCase() == "prod")
        return config.prod;
        
}