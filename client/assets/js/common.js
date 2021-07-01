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

        // adiciona a modal de login e cadastro
        $('#containerLogin').load('/login.html');

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

        $("#listPostsPopular").html('')

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

        $.each(list, (i, e) => {

            var temp = common.templates.postPopular;

            $("#listPostsPopular").append(
                temp.replace(/\${idnoticia}/g, e.idnoticia)
                    .replace(/\${capa}/g, e.capa)
                    .replace(/\${titulo}/g, e.titulo)
                    .replace(/\${descricao}/g, e.descricao)
                    .replace(/\${data}/g, e.datapub)
            );

            // ultimo item, carrega o slider
            if ((i + 1) == list.length) {

                $('.slider').slick({
                    dots: false,
                    infinite: false,
                    speed: 300,
                    slidesToShow: 3,
                    centerMode: false,
                    variableWidth: true
                });

            }

        })

    },

    enviarEmail: () => {

        // valida os dados

        var email = $("#txtEmailNovidades").val().trim();

        if (email == "" || email == null || !app.metodos.isEmail(email)) {
            alert('Informe um e-mail válido, por favor')
            $("#txtEmailNovidades").focus()
            return;
        }

        var dados = {
            emailusuario: email
        }

        app.metodos.post('/email/adicionar', JSON.stringify(dados),
            (response) => {

                var retorno = response;
                console.log('retorno', retorno)

                alert(retorno.mensagem)

                $("#txtEmailNovidades").val('')

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
    `,

    postPopular: `
        <div class="card card-popular">
            <a href="/detalhes.html?n=\${idnoticia}" class="link-card-popular">
                <div class="img-card-popupar" style="background-image: url('\${capa}'); background-size: cover;"></div>
                <div class="card-popular-body">
                    <h2>\${titulo}</h2>
                    <p>\${descricao}</p>
                    <label>$\{data}</label>
                </div>
            </a>
        </div>    
    `

}