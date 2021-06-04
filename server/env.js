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
    }
}

exports.get = function get(env) {

    if(env.toLowerCase() == "dev")
        return config.dev;
        
}