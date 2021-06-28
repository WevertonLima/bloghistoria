$(document).ready(function () {
    home.eventos.init();
})

var home = {};

var PAGINA = 1;
var TOTAL_P_PAGINA = 5;

home.eventos = {

    init: () => {

        app.eventos.init();
        home.metodos.obterPosts();
        
    }

}

home.metodos = {

    obterPosts: () => {        

        app.metodos.get('/obterposts',
            (response) => {

                var posts = response;
                console.log('posts', posts)

                home.metodos.carregarPosts(posts)

            },
            (xhr, ajaxOptions, error) => {
                console.log('xhr', xhr);
                console.log('ajaxOptions', ajaxOptions);
                console.log('error', error);
                app.metodos.mensagem("Falha ao realizar operação. Tente novamente.");
                return;
            },
            true
        );

    },

    carregarPosts: (list) => {

    }

}