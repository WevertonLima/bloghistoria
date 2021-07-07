$(document).ready(function () {
    detalhes.eventos.init();
})

var detalhes = {};

var POST_ID = 0;

var TOTAL_LIKES = 0;
var USUARIO_CURTIU = false;

detalhes.eventos = {

    init: () => {

        app.eventos.init();

        detalhes.metodos.getParamUrl();
        detalhes.metodos.obterPostPorId();

        detalhes.metodos.obterTagsPost();
        detalhes.metodos.obterCurtidaUsuario();
        detalhes.metodos.obterComentarios();

        $("#btnComentar").on('click', () => {
            detalhes.metodos.enviarComentario();
        })

        // insere a foto do usuario no comentario
        var _avatar = app.metodos.obterValorSessao('avatar')

        if (_avatar != undefined && _avatar != null && _avatar != "") {
            $("#imgUserComment").css('background-image', `url('${_avatar}')`);
            $("#imgUserComment").css('background-size', 'cover');
        }
        else {
            $("#imgUserComment").css('background-image', `url('/assets/img/user.png')`);
            $("#imgUserComment").css('background-size', 'cover');
        }

    }

}

detalhes.metodos = {

    getParamUrl: () => {

        var url_string = window.location.href
        var url = new URL(url_string);
        POST_ID = url.searchParams.get("n");
        console.log('POST_ID', POST_ID);

        if (POST_ID == null || POST_ID == "") {
            detalhes.metodos.redirectHome();
        }

    },

    redirectHome: () => {
        window.location.href = '/';
    },

    checkUsuarioLogado: () => {

        var _token = app.metodos.obterValorSessao('token')

        if (_token != undefined && _token != null && _token != "") {
            return true;
        }
        else {
            return false;
        }

    },

    obterPostPorId: () => {

        app.metodos.get('/obterpostporid/' + POST_ID,
            (response) => {

                var post = response;
                console.log('post', post)

                //home.metodos.carregarPosts(posts)
                if (post.length < 1) {
                    detalhes.metodos.redirectHome();
                }
                else {

                    TOTAL_LIKES = post[0].curtidas;

                    $("#lblDataPub").text(post[0].datapub)
                    $("#lblTitulo").text(post[0].titulo)
                    $("#lblDescricao").text(post[0].descricao)
                    $("#lblConteudo").html(post[0].conteudo)
                    $("#lblTotalLikes").text(post[0].curtidas)

                    if (post[0].capa != null) {
                        $("#containerCapa").html(`<img class="capa" src="${post[0].capa}" />`)
                    }

                    detalhes.metodos.adicionarAcesso(post[0].acessos)

                }

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

    // convert o buffer para imagem
    toBase64: (arr) => {
        //arr = new Uint8Array(arr) if it's an ArrayBuffer
        return btoa(
            arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
    },

    adicionarAcesso: (acessos) => {

        var dados = {
            acessos: acessos + 1,
            idnoticia: POST_ID
        }

        app.metodos.post('/acesso', JSON.stringify(dados),
            (response) => {

                var retorno = response;
                //console.log('retorno', retorno)

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

    obterCurtidaUsuario: () => {

        if (detalhes.metodos.checkUsuarioLogado()) {

            app.metodos.get('/obtercurtidausuario/' + POST_ID,
                (response) => {

                    var curtiu = response;
                    console.log('curtiu', curtiu)

                    if (curtiu.length > 0) {

                        USUARIO_CURTIU = true;

                        $(".icon-like").addClass('liked');
                        $("#iconLike").addClass('fa-heart');
                        $("#iconLike").removeClass('fa-heart-o');

                    }

                },
                (xhr, ajaxOptions, error) => {
                    console.log('xhr', xhr);
                    console.log('ajaxOptions', ajaxOptions);
                    console.log('error', error);
                    app.metodos.mensagem("Falha ao realizar operação. Tente novamente.");
                    return;
                }
            );

        }
        else {

            // bloaqueia o botão curtir
            $("#btnLike").addClass('disabled');
            $("#btnLike").attr('onclick', '');

            detalhes.metodos.curtir = null;
            detalhes.metodos.updatecurtir = null;

        }

    },

    obterComentarios: () => {

        // primeiro valida se o usuário está logado
        if (detalhes.metodos.checkUsuarioLogado()) {
            $(".card-comentario").removeClass('hidden')
            $(".card-comentario-block").remove();
        }
        else {
            $(".card-comentario").remove()
            $(".card-comentario-block").removeClass('hidden');
        }

        $(".list-comentarios").html('');

        app.metodos.get('/obtercomentarios/' + POST_ID,
            (response) => {

                var comentarios = response;
                console.log('comentarios', comentarios)

                detalhes.metodos.carregarComentarios(comentarios);

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

    carregarComentarios: (list) => {

        $("#lblTotalComentarios").text(list.length)

        $.each(list, (i, e) => {

            var temp = detalhes.templates.itemComentario;

            let removerComentario = '';

            if (e.ad == 1 || e.adg == 1) {
                removerComentario = `
                    <a href="#!" class="btn-remover-comentario" onclick="detalhes.metodos.openModalExcluirComentario('${e.idcomentario}')">
                        <i class="fa fa-trash"></i>
                    </a>
                `
            }

            let _avatar = e.avatar;

            if (_avatar == null) {
                // define o avatar padrão
                _avatar = '/assets/img/user.png'
            }

            $(".list-comentarios").append(
                temp.replace(/\${idcomentario}/g, e.idcomentario)
                    .replace(/\${texto}/g, e.texto)
                    .replace(/\${nome}/g, e.nome)
                    .replace(/\${datacad}/g, e.datacad)
                    .replace(/\${avatar}/g, _avatar)
                    .replace(/\${removerComentario}/g, removerComentario)
            );

        })

    },

    openModalExcluirComentario: (id) => {

        $("#btnRemoverComentario").attr('onclick', `detalhes.metodos.removerComentario(${id})`)
        $("#modalRemoverComentario").modal('show')

    },

    removerComentario: (id) => {

        var dados = {
            idcomentario: id
        }

        app.metodos.post('/comentario/remover', JSON.stringify(dados),
            (response) => {

                var retorno = response;
                console.log('retorno', retorno)

                //alert('Comentário removido com sucesso!')
                $("#modalRemoverComentario").modal('hide')
                $("#btnRemoverComentario").attr('onclick', '')

                detalhes.metodos.obterComentarios();

            },
            (xhr, ajaxOptions, error) => {
                console.log('xhr', xhr);
                console.log('ajaxOptions', ajaxOptions);
                console.log('error', error);
                app.metodos.mensagem("Falha ao realizar operação. Tente novamente.");
                return;
            }
        );

    },

    enviarComentario: () => {

        var texto = $("#txtComentario").val().trim();

        if (texto.length == 0) {
            alert('Informe o comentário, por favor.')
            $("#txtComentario").focus();
            return;
        }

        var dados = {
            idnoticia: POST_ID,
            texto: texto
        }

        app.metodos.post('/comentario/adicionar', JSON.stringify(dados),
            (response) => {

                var retorno = response;
                console.log('retorno', retorno)

                $("#txtComentario").val('')
                detalhes.metodos.obterComentarios();

            },
            (xhr, ajaxOptions, error) => {
                console.log('xhr', xhr);
                console.log('ajaxOptions', ajaxOptions);
                console.log('error', error);
                app.metodos.mensagem("Falha ao realizar operação. Tente novamente.");
                return;
            }
        );

    },

    obterTagsPost: () => {

        $(".list-tags-detalhes").html('');

        app.metodos.get('/obtertagspost/' + POST_ID,
            (response) => {

                var tagsPost = response;
                console.log('tagsPost', tagsPost)

                detalhes.metodos.carregarTags(tagsPost)

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

            let _desc = e.descricao;

            if (_desc.indexOf('#') < 0) {
                _desc = '#' + _desc
            }

            let _tag = `<a class="badge">${_desc}</a>`

            $(".list-tags-detalhes").append(_tag);

        })

    },

    curtir: () => {

        if (USUARIO_CURTIU) {

            // descurtir
            detalhes.metodos.updatecurtir(0);

            USUARIO_CURTIU = false;
            TOTAL_LIKES--;

            $("#lblTotalLikes").text(TOTAL_LIKES);

            $(".icon-like").removeClass('liked');
            $("#iconLike").removeClass('fa-heart');
            $("#iconLike").addClass('fa-heart-o');

        }
        else {

            //curtir
            detalhes.metodos.updatecurtir(1);

            USUARIO_CURTIU = true;
            TOTAL_LIKES++;

            $("#lblTotalLikes").text(TOTAL_LIKES);

            $(".icon-like").addClass('liked');
            $("#iconLike").addClass('fa-heart');
            $("#iconLike").removeClass('fa-heart-o');

        }

    },

    updatecurtir: (curtir) => {

        var dados = {
            idnoticia: POST_ID,
            curtir: curtir
        }

        app.metodos.post('/curtir', JSON.stringify(dados),
            (response) => {

                var retorno = response;
                //console.log('retorno', retorno)

            },
            (xhr, ajaxOptions, error) => {
                console.log('xhr', xhr);
                console.log('ajaxOptions', ajaxOptions);
                console.log('error', error);
                app.metodos.mensagem("Falha ao realizar operação. Tente novamente.");
                return;
            }
        );

    }

}

detalhes.templates = {

    itemComentario: `
        <div class="card-comentario" id="comentario-\${idcomentario}">
            <div class="row">
                <div class="col-2">
                    <div class="user-image" style="background-image: url('\${avatar}'); background-size: cover;"></div>
                </div>
                <div class="col-10 pl-0">
                    <div class="comentario-content">
                        \${removerComentario}
                        <p class="comentario-nome-usuario">\${nome}</p>
                        <p class="comentario-texto">
                            \${texto}
                        </p>
                        <span class="comentario-data-hora">\${datacad}</span>
                    </div>
                </div>
            </div>
        </div>
    `

}

