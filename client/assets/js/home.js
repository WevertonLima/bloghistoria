$(document).ready(function () {
    home.eventos.init();
})

var home = {};

var LISTA_POSTS = [];
var PAGINA = 0;
var TOTAL_P_PAGINA = 6;
var AUX_PAGE = 6;

home.eventos = {

    init: () => {

        $("#btnCarregarMais").on('click', () => {
            home.metodos.carregarPosts(LISTA_POSTS);
        })

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
                LISTA_POSTS = posts;

                home.metodos.carregarPosts(posts)

                $("#container-loader").addClass('hidden')
                $("#container-ver-mais").removeClass('hidden')

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

        // remove o botão de carregar mais posts
        let total_posts = LISTA_POSTS.length;

        if (total_posts <= TOTAL_P_PAGINA) {
            $("#container-ver-mais").remove();
        }

        // carrega os posts paginados

        for (var i = PAGINA; i < TOTAL_P_PAGINA; i++) {

            if (list[i] != undefined) {

                let temp = home.templates.post;

                let _capa = '';
    
                if (list[i].formato != null && list[i].formato != '') {
                    // _capa = `
                    //     <a href="/detalhes.html?n=${list[i].idnoticia}" class="link-capa">
                    //         <img class="capa" src="${list[i].capa}" />
                    //     </a>
                    // `
                    let _formato = list[i].formato.split(';base64,')[0].split('/')[1]
                    _capa = `
                        <a href="/detalhes.html?n=${list[i].idnoticia}" class="link-capa">
                            <img class="capa" src="${window.location.origin}/shared/img/post${list[i].idnoticia}.${_formato}" />
                        </a>
                    `
                }
    
                $("#listPosts").append(
                    temp.replace(/\${idnoticia}/g, list[i].idnoticia)
                        .replace(/\${content_capa}/g, _capa)
                        .replace(/\${titulo}/g, list[i].titulo)
                        .replace(/\${descricao}/g, list[i].descricao)
                        .replace(/\${data}/g, list[i].datapub)
                        .replace(/\${acessos}/g, list[i].acessos)
                        .replace(/\${comentarios}/g, list[i].comentarios)
                        .replace(/\${curtidas}/g, list[i].curtidas)
                );
            }

        }

        PAGINA += AUX_PAGE;
        TOTAL_P_PAGINA += AUX_PAGE;

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
                            <a class="btn-share dropdown-toggle" id="ddlShare"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="fa fa-share-alt"></span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="ddlShare">
                                <a href="https://www.facebook.com/sharer/sharer.php?u=http://bebedourohistoriaememoria.com.br/shared/post\${idnoticia}.html"
                                    onclick="window.open(this.href, 'facebook-share','width=580, height=550');return false;"
                                    class="dropdown-item">
                                    <span class="fa fa-facebook icon-share"></span>&nbsp; Facebook
                                </a>
                                <a href="https://api.whatsapp.com/send?text=http://bebedourohistoriaememoria.com.br/shared/post\${idnoticia}.html"
                                    data-action="share/whatsapp/share"
                                    onclick="window.open(this.href, 'whatsapp-share', 'width=550, height=550');return false;"
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