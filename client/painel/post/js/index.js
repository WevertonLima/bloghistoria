$(document).ready(function () {
    post.eventos.init();
})

var post = {};

var EDICAO = false;

post.eventos = {

    init: () => {

        // carrega a master page (barra de menus)
        $('#master').load('/painel/master/menu.html');

        // inicia a listagem dos posts
        post.metodos.carregarPosts();

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
                    

                    if (elem.capa == null) {
                        elem.spCapa = "-"
                    }
                    else {
                        let _capa = `<div class="capa-post" style="background-image: url('${elem.capa}'); background-size: cover;"></div>`
                        elem.spCapa = _capa;
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
                        //{ data: "descricao" },
                        { data: "datapub" },
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
                        <th class="text-muted">Data Pub.</th>
                        <th class="text-muted">Ativa</th>
                        <th colspan="2" class="text-muted text-center">Ações</th>
                    </tr>
                </thead>
            </table>`

}