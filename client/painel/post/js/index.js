$(document).ready(function () {
    post.eventos.init();
})

var post = {};

var EDICAO = false;
var B64CAPA = null;

var LIST_CATEGORIAS = [];
var LIST_TAGS = [];

post.eventos = {

    init: () => {

        // carrega a master page (barra de menus)
        $('#master').load('/painel/master/menu.html');

        // inicia a listagem dos posts
        post.metodos.carregarPosts();

        post.metodos.obterCategorias();
        post.metodos.obterTags();

        $("#btnSalvar").on('click', () => {
            post.metodos.validaFormulario();
        });

        $('#txtConteudo').summernote({
            placeholder: 'Insira a descrição aqui',
            tabsize: 2,
            height: 150,
            lang: 'pt-BR',
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link']],
                ['view', ['fullscreen']]
            ]
        });

        $('.select2').select2({
            placeholder: 'Selecione uma opção'
        });

        setTimeout(() => {
            $(".main-content").removeClass('hidden');
        }, 200);

    }

}


post.metodos = {

    carregarPosts: () => {

        // chama o método de carregar posts
        app.metodos.get('/post/consultar',
            (response) => {

                var posts = response;

                console.log('posts', posts)

                // adciona a coluna de ação nos registros
                $.each(posts, (i, elem) => {
                    elem.Acoes = `<div class="dropdown">
                                    <a href="#" class="btn btn-sm btn-outline-secondary dropdown-ellipses dropdown-toggle" data-toggle="dropdown">
                                        Ações &nbsp<i class="fe fe-arrow-down"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <a href="#!" class="dropdown-item" onclick="post.metodos.carregarEdicao(` + elem.idnoticia + `)">
                                            <i class="fe fe-edit"></i>&nbsp; Editar
                                        </a>
                                        {Opcao}
                                    </div>
                                </div>`;

                    let opcao = '';

                    if (elem.ativo > 0) {
                        opcao = `<a href="#!" class="dropdown-item" onclick="post.metodos.abrirModalAtivar(` + elem.idnoticia + `, 0)">
                                    <i class="fe fe-disabled"></i>&nbsp; Desativar
                                </a>`;

                        elem.spAtivo = '<span class="badge badge-success">Sim</span>';
                    }
                    else {
                        opcao = `<a href="#!" class="dropdown-item" onclick="post.metodos.abrirModalAtivar(` + elem.idnoticia + `, 1)">
                                    <i class="fe fe-check"></i>&nbsp; Ativar
                                </a>`;

                        elem.spAtivo = '<span class="badge badge-danger">Não</span>'
                    }

                    elem.Acoes = elem.Acoes.replace('{Opcao}', opcao);

                    // capa
                    if (elem.capa == null || elem.capa == '') {
                        elem.spCapa = "-"
                    }
                    else {
                        let _capa = `<div class="capa-post" style="background-image: url('${elem.capa}'); background-size: cover;"></div>`
                        elem.spCapa = _capa;
                    }

                    // categoria
                    if (elem.idcategoria == null) {
                        elem.spCategoria = "-";
                    }
                    else {
                        elem.spCategoria = elem.categoria;
                    }

                });

                // recria a tabela de posts
                $("#containerTabela").html('');

                $("#containerTabela").append(post.templates.tabela);

                // cria a tabela
                $("#tblPosts").DataTable({
                    destroy: true,
                    aaSorting: [[0]],
                    dom: 'Bfrtipl',
                    lengthMenu: [[10, 25, 50, -1], ['10 linhas', '25 linhas', '50 linhas', 'Todas']],
                    columnDefs: [{ targets: [5], className: 'text-center' }],
                    buttons: ['pageLength'],
                    "data": posts,
                    "columns": [
                        { data: "idnoticia" },
                        { data: "spCapa" },
                        { data: "titulo" },
                        { data: "spCategoria" },
                        //{ data: "descricao" },
                        { data: "datapub" },
                        { data: "acessos" },
                        { data: "spAtivo" },
                        { data: "Acoes" }
                    ],
                    "language": {
                        "url": "/assets/js/datatable.pt-BR.json"
                        , buttons: {
                            pageLength: {
                                _: "Mostrar %d linhas",
                                '-1': "Mostrar Todos"
                            }
                        }
                    }

                });

                setTimeout(() => {
                    $("div.dataTables_wrapper div.dataTables_filter input").attr('placeholder', 'Pesquise as publicações aqui...');
                }, 150)

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

    obterCategorias: () => {

        app.metodos.get('/obtercategorias',
            (response) => {
                var categorias = response;
                console.log('categorias', categorias)
                LIST_CATEGORIAS = categorias;

                // carrega as categorias
                $.each(categorias, (i, e) => {
                    var data = { id: e.idcategoria, text: e.descricao };
                    var newOption = new Option(data.text, data.id, false, false);
                    $('#ddlCategoriaPub').append(newOption).trigger('change');
                })

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

    changeCategoria: () => {

        let _selected = $('#ddlCategoriaPub').select2('data');

        if (_selected.length > 0) {
            $('#btnRemoverCategoria').removeClass('hidden');
        }
        else {
            $('#btnRemoverCategoria').addClass('hidden');
        }

    },

    removerCategoria: () => {
        $("#ddlCategoriaPub").val(null).trigger('change');
        $('#btnRemoverCategoria').addClass('hidden');
    },

    obterTags: () => {

        app.metodos.get('/obtertags',
            (response) => {
                var tags = response;
                console.log('tags', tags)
                LIST_TAGS = tags;
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

    adicionar: (dados) => {

        // chama o método de adicionar
        app.metodos.post('/post/adicionar', JSON.stringify(dados),
            (response) => {

                console.log(response);

                if (response.resultado == "erro") {
                    app.metodos.mensagem(response.msg);
                    console.log("Erro interno: ", response.ex);
                    return;
                }

                if (response.resultado == "sucesso") {
                    app.metodos.mensagem(response.msg, 'green');
                    $("#modalForm").modal('toggle');
                    post.metodos.carregarPosts();
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

    },

    editar: (dados) => {

        // chama o método de editar
        app.metodos.put('/post/atualizar', JSON.stringify(dados),
            (response) => {

                if (response.resultado == "erro") {
                    app.metodos.mensagem(response.msg);
                    console.log("Erro interno: ", response.ex);
                    return;
                }

                if (response.resultado == "sucesso") {
                    app.metodos.mensagem(response.msg, 'green');
                    $("#modalForm").modal('toggle');

                    // recarrega a tabela
                    post.metodos.carregarPosts();
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

    },

    carregarEdicao: (id) => {

        post.metodos.limparCampos();
        EDICAO = true;

        // habilita as tabs
        $("#nav-categoria-tab").removeClass('disabled');
        $("#nav-tags-tab").removeClass('disabled');

        // abre a modal
        $("#modalForm").modal('show');

        // chama o método de obter por id
        app.metodos.get('/post/editar/' + id,
            (response) => {

                var post = response[0];
                console.log(post)

                // passa as informações para os campos
                $("#hdfPostId").val(post.idnoticia);
                $("#txtTitulo").val(post.titulo);
                $("#txtDescricao").val(post.descricao);
                $('#txtConteudo').summernote('code', post.conteudo);

                if (post.capa != "" && post.capa != null) {
                    $("#imageView").css('background-image', `url('${post.capa}')`);
                    $("#imageView").css('background-size', 'cover');
                    B64CAPA = post.capa;
                    $("#btnRemoverCapa").removeClass('hidden');
                }

                // carrega a categoria
                if (post.idcategoria != null) {
                    $('#ddlCategoriaPub').val(post.idcategoria);
                    $('#ddlCategoriaPub').trigger('change');
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

    },

    ativar: (ativar) => {

        var idnoticia = $("#hdfPostId").val();

        if (idnoticia != undefined && idnoticia != '') {

            var dados = {
                idnoticia: idnoticia,
                ativo: ativar
            }

            // chama o método de ativar / desativar
            app.metodos.post('/post/ativar', JSON.stringify(dados),
                (response) => {

                    if (response.resultado == "erro") {
                        app.metodos.mensagem(response.msg);
                        console.log("Erro interno: ", response.ex);
                        return;
                    }

                    if (response.resultado == "sucesso") {
                        app.metodos.mensagem(response.msg, 'green');
                        $("#modalAtivar").modal('toggle');

                        // recarrega a tabela
                        post.metodos.carregarPosts();
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

    },

    validaFormulario: () => {

        // valida os campos 
        var titulo = $("#txtTitulo").val().trim();
        var descricao = $("#txtDescricao").val().trim().replace(/\'/g, '');
        var conteudo = $('#txtConteudo').summernote('code').replace(/\'/g, '');
        var capa = B64CAPA;
        var idnoticia = $("#hdfPostId").val();
        var listCategoria = $('#ddlCategoriaPub').select2('data');
        var idcategoria = null;

        if (titulo == '' || titulo == undefined) {
            $("#nav-principal-tab").click();
            app.metodos.mensagem("Informe o título, por favor.");
            $("#txtTitulo").focus();
            return;
        }

        if (descricao == '' || descricao == undefined) {
            $("#nav-principal-tab").click();
            app.metodos.mensagem("Informe a descrição, por favor.");
            $("#txtDescricao").focus();
            return;
        }

        if (conteudo == '' || conteudo == undefined) {
            $("#nav-principal-tab").click();
            app.metodos.mensagem("Informe o conteúdo, por favor.");
            $("#txtConteudo").focus();
            return;
        }

        // valida a categoria
        if (listCategoria.length > 0) {
            idcategoria = parseInt(listCategoria[0].id);
        }

        var dados = {
            idnoticia: idnoticia,
            idcategoria: idcategoria,
            strtitulo: titulo,
            strdescricao: descricao,
            strcapa: capa,
            conteudo: conteudo
        }

        console.log(dados)

        if (EDICAO) {
            post.metodos.editar(dados);
        }
        else {
            post.metodos.adicionar(dados);
        }

    },

    abrirModal: () => {
        post.metodos.limparCampos();
        EDICAO = false;

        // desabilita as tabs
        $("#nav-categoria-tab").addClass('disabled');
        $("#nav-tags-tab").addClass('disabled');

    },

    abrirModalAtivar: (id, ativar) => {

        $("#hdfPostId").val(id);

        if (ativar == 1) {
            $("#lblTituloModalAtivar").text('Ativar Publicação');
            $("#lblTextoConfirm").text('Deseja realmente ativar a publicação?');

            $("#btnAtivar").removeClass('hidden');
            $("#btnDesativar").addClass('hidden');
        }
        else {
            $("#lblTituloModalAtivar").text('Desativar Publicação');
            $("#lblTextoConfirm").text('Deseja realmente desativar a publicação?');

            $("#btnAtivar").addClass('hidden');
            $("#btnDesativar").removeClass('hidden');
        }

        $("#modalAtivar").modal('toggle');

    },

    limparCampos: () => {
        $("#txtTitulo").val('');
        $("#txtDescricao").val('');
        $("#hdfPostId").val('');
        $('#txtConteudo').summernote('code', '');
        post.metodos.removerCapa();
        $("#nav-principal-tab").click();
        $('.select2').val(null).trigger('change');
    },

    carregarCapa: () => {

        let file = document.getElementById('fileCapa').files[0];

        console.log('file', file);

        if (file == undefined) {
            $("#imageView").css('background-image', 'none');
            $("#btnRemoverCapa").addClass('hidden');
            B64CAPA = null;
            return;
        }
        else {
            $("#btnRemoverCapa").removeClass('hidden');
        }

        function readFile(file) {
            return new Promise((resolve, reject) => {
                let myReader = new FileReader();
                myReader.onloadend = function (e) {
                    resolve(myReader.result);
                };
                myReader.readAsDataURL(file);
            })
        };

        readFile(file).then(function (base64string) {

            $("#imageView").css('background-image', `url('${base64string}')`);
            $("#imageView").css('background-size', 'cover');
            B64CAPA = base64string;

        })

    },

    removerCapa: () => {
        document.getElementById('fileCapa').value = "";
        $("#imageView").css('background-image', 'none');
        $("#btnRemoverCapa").addClass('hidden');
        B64CAPA = null;
    },




    // usar para galeria
    OLDuploadImage: () => {

        let file = document.getElementById('file').files[0];

        function readFile(file) {
            return new Promise((resolve, reject) => {
                let myReader = new FileReader();
                myReader.onloadend = function (e) {
                    resolve(myReader.result);
                };
                myReader.readAsDataURL(file);
            })
        };

        readFile(file).then(function (base64string) {
            console.log('base64string', base64string)

            var dados = {
                base64Image: base64string
            };

            app.metodos.post('/post/adicionarCapa', JSON.stringify(dados),
                (response) => {

                    console.log(response);

                },
                (xhr, ajaxOptions, error) => {
                    console.log('xhr', xhr);
                    console.log('ajaxOptions', ajaxOptions);
                    console.log('error', error);
                    app.metodos.mensagem("Falha ao realizar operação. Tente novamente.");
                    return;
                }
            );

        })

    }

}


post.templates = {

    tabela: `<table id="tblPosts" class="table table-sm table-nowrap card-table">
                <thead>
                    <tr>
                        <th class="text-muted">ID</th>
                        <th class="text-muted">Capa</th>
                        <th class="text-muted">Título</th>
                        <th class="text-muted">Categoria</th>
                        <th class="text-muted">Data Pub.</th>
                        <th class="text-muted">Acessos</th>
                        <th class="text-muted">Ativa</th>
                        <th colspan="2" class="text-muted text-center">Ações</th>
                    </tr>
                </thead>
            </table>`

}