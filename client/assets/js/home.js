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

        $("#listPosts").html('')

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

        $.each(list, (i, e) => {

            var temp = home.templates.post;

            let _capa = '';

            if (e.capa != null) {
                _capa = `
                    <a href="/detalhes.html?n=${e.idnoticia}" class="link-capa">
                        <img class="capa" src="${e.capa}" />
                    </a>
                `
            }

            $("#listPosts").append(
                temp.replace(/\${idnoticia}/g, e.idnoticia)
                    .replace(/\${content_capa}/g, _capa)
                    .replace(/\${titulo}/g, e.titulo)
                    .replace(/\${descricao}/g, e.descricao)
                    .replace(/\${data}/g, e.datapub)
                    .replace(/\${acessos}/g, e.acessos)
                    .replace(/\${comentarios}/g, e.comentarios)
                    .replace(/\${curtidas}/g, e.curtidas)
            );

        })

    }

}

home.templates = {

    post: `
        <article class="post card">
            \${content_capa}
            <div class="post-body">
                <div class="post-meta clearfix">
                    <span class="date">
                        <time datetime="2016-18-3">\${data}</time>
                    </span>
                    <div class="share">
                        <div class="dropdown">
                            <a class="btn-share dropdown-toggle" type="button" id="ddlShare"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="fa fa-share-alt"></span>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="ddlShare">
                                <a href="https://www.facebook.com/sharer/sharer.php?u=URL"
                                    onclick="window.open(this.href, 'facebook-share','width=580,height=550');return false;"
                                    class="dropdown-item">
                                    <span class="fa fa-facebook icon-share"></span>&nbsp; Facebook
                                </a>
                                <a href="https://twitter.com/share?url=URL"
                                    onclick="window.open(this.href, 'twitter-share', 'width=550,height=550');return false;"
                                    class="dropdown-item">
                                    <span class="fa fa-twitter icon-share"></span>&nbsp; Twitter
                                </a>
                                <a href="https://api.whatsapp.com/send?text=URL"
                                    data-action="share/whatsapp/share"
                                    onclick="window.open(this.href, 'whatsapp-share', 'width=550,height=550');return false;"
                                    class="dropdown-item">
                                    <span class="fa fa-whatsapp icon-share"></span>&nbsp; WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="post-content">
                    <a href="/detalhes.html?n=\${idnoticia}"><h2>\${titulo}</h2></a>
                    <p>\${descricao}</p>
                </div>
                <div class="post-footer text-right">
                    <span class="icon-views mr-3">
                        <i class="fa fa-eye"></i> \${acessos}
                    </span>
                    <span class="icon-comment mr-3">
                        <i class="fa fa-comment-o"></i> \${comentarios}
                    </span>
                    <span class="icon-like">
                        <i class="fa fa-heart-o"></i> \${curtidas}
                    </span>
                </div>
            </div>
        </article>
    `

}