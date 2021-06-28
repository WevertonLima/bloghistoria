$(document).ready(function () {
    common.eventos.init();
})

var common = {};

common.eventos = {

    init: () => {

        common.metodos.obterCategoriasDestaques();
        common.metodos.obterSobre();
        common.metodos.obterCategorias();
        common.metodos.obterTags();

        common.metodos.obterPostsPopulares();

    }

}

common.metodos = {

    obterCategoriasDestaques: () => {

        $("#menuDestaques").html('');
        $("#menuDestaquesLeft").html('')

        app.metodos.get('/obtercategoriasdestaques',
            (response) => {

                var categorias = response;
                console.log('categorias', categorias)

                common.metodos.carregarCategoriasDestaques(categorias)
                common.metodos.carregarCategoriasDestaquesLeft(categorias)

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

    carregarCategoriasDestaques: (list) => {

        $.each(list, (i, e) => {

            var temp = common.templates.itemMenuDestaque;

            $("#menuDestaques").append(
                temp.replace(/\${descricao}/g, e.descricao)
            );

        })

    },

    carregarCategoriasDestaquesLeft: (list) => {

        $.each(list, (i, e) => {

            var temp = common.templates.itemMenuDestaqueLeft;

            $("#menuDestaquesLeft").append(
                temp.replace(/\${descricao}/g, e.descricao)
            );

        })

    },


    obterCategorias: () => {

        $(".list-categoria ul").html('');

        app.metodos.get('/obtercategorias',
            (response) => {

                var categorias = response;
                console.log('categorias', categorias)

                common.metodos.carregarCategorias(categorias)

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

    carregarCategorias: (list) => {

        $.each(list, (i, e) => {

            var temp = common.templates.itemCategoria;

            $(".list-categoria ul").append(
                temp.replace(/\${descricao}/g, e.descricao)
            );

        })

    },

    obterTags: () => {

        $(".list-tags").html('');

        app.metodos.get('/obtertags',
            (response) => {

                var tags = response;
                console.log('tags', tags)

                common.metodos.carregarTags(tags)

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

    carregarTags: (list) => {

        $.each(list, (i, e) => {

            var temp = common.templates.itemTag;
            let _desc = e.descricao;

            if (_desc.indexOf('#') < 0) {
                _desc = '#' + _desc
            }

            $(".list-tags").append(
                temp.replace(/\${descricao}/g, _desc)
            );

        })

    },

    obterSobre: () => {

        $("#lblSobreAutor").text('');
        $("#lblSobreBlog").text('');

        app.metodos.get('/obtersobre',
            (response) => {

                var sobre = response;
                console.log('sobre', sobre)

                $("#lblSobreAutor").text(sobre[0].descricaoautor);
                $("#lblSobreBlog").text(sobre[0].descricaoblog);

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


    obterPostsPopulares: () => {

        app.metodos.get('/obterpostspopulares',
            (response) => {

                var postspopulares = response;
                console.log('postspopulares', postspopulares)

                common.metodos.carregarPostsPopulares(postspopulares)

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

    carregarPostsPopulares: (list) => {
        
    }


}

common.templates = {

    itemCategoria: `
        <li>
            <a href="/pesquisa?t=2&d=\${descricao}" class="item-categoria">
                <span class="before"><i class="fa fa-folder-o"></i></span>\${descricao}
            </a>
        </li>
    `,

    itemTag: `
        <a href="/pesquisa?t=3&d=\${descricao}" class="badge">\${descricao}</a>
    `,

    itemMenuDestaque: `
        <a href="/pesquisa?t=2&d=\${descricao}" class="menu-item">\${descricao}</a>
    `,

    itemMenuDestaqueLeft: `
        <a href="/pesquisa?t=2&d=\${descricao}" class="menu-item-left">\${descricao}</a>
    `

}