$(document).ready(function () {
    categoria.eventos.init();
})

var categoria = {};

var EDICAO = false;

categoria.eventos = {

    init: () => {

        // carrega a master page (barra de menus)
        $('#master').load('/painel/master/menu.html');

        // inicia a listagem das categorias
        categoria.metodos.carregarCategorias();

        $("#btnSalvar").on('click', () => {
            categoria.metodos.validaFormulario();
        });

        setTimeout(() => {
            $(".main-content").removeClass('hidden');
        }, 200);

        $("#menuCategoria").parent('li').addClass('active')

    }

}

categoria.metodos = {

    carregarCategorias: () => {

        // chama o método de carregar categorias
        app.metodos.get('/categorias',
            (response) => {

                var categorias = response;

                console.log('categorias', categorias)

                // adciona a coluna de ação nos registros
                $.each(categorias, (i, elem) => {
                    elem.Acoes = `<div class="dropdown">
                                    <a href="#" class="btn btn-sm btn-outline-secondary dropdown-ellipses dropdown-toggle" data-toggle="dropdown">
                                        Ações &nbsp<i class="fe fe-arrow-down"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <a href="#!" class="dropdown-item" onclick="categoria.metodos.carregarEdicao(` + elem.idcategoria + `)">
                                            <i class="fe fe-edit"></i>&nbsp; Editar
                                        </a>
                                        {Opcao}
                                        <p class="separate"></p>
                                        {OpcaoDestaque}
                                    </div>
                                </div>`;

                    let opcao = '';

                    if (elem.ativo > 0) {
                        opcao = `<a href="#!" class="dropdown-item" onclick="categoria.metodos.abrirModalAtivar(` + elem.idcategoria + `, 0)">
                                    <i class="fe fe-disabled"></i>&nbsp; Desativar
                                </a>`;

                        elem.spAtivo = '<span class="badge badge-success">Sim</span>';
                    }
                    else {
                        opcao = `<a href="#!" class="dropdown-item" onclick="categoria.metodos.abrirModalAtivar(` + elem.idcategoria + `, 1)">
                                    <i class="fe fe-check"></i>&nbsp; Ativar
                                </a>`;

                        elem.spAtivo = '<span class="badge badge-danger">Não</span>'
                    }

                    elem.Acoes = elem.Acoes.replace('{Opcao}', opcao);


                    let opcaoDestaque = '';

                    if (elem.destaque > 0) {
                        opcaoDestaque = `<a href="#!" class="dropdown-item" onclick="categoria.metodos.abrirModalDestacar(` + elem.idcategoria + `, 0)">
                                            <i class="fe fe-star-o"></i>&nbsp; Remover Destaque
                                        </a>`;

                        elem.spDestaque = `<span class="badge badge-light"><i class="fe fe-star"></i>&nbsp; Principal</span>`;
                    }
                    else {
                        opcaoDestaque = `<a href="#!" class="dropdown-item" onclick="categoria.metodos.abrirModalDestacar(` + elem.idcategoria + `, 1)">
                                            <i class="fe fe-star"></i>&nbsp; Destacar
                                        </a>`;

                        elem.spDestaque = '-'
                    }

                    elem.Acoes = elem.Acoes.replace('{OpcaoDestaque}', opcaoDestaque);

                });

                console.log(categorias);

                // recria a tabela de categorias
                $("#containerTabela").html('');

                $("#containerTabela").append(categoria.templates.tabela);

                // cria a tabela
                $("#tblCategorias").DataTable({
                    destroy: true,
                    aaSorting: [[2]],
                    dom: 'Bfrtipl',
                    lengthMenu: [[10, 25, 50, -1], ['10 linhas', '25 linhas', '50 linhas', 'Todas']],
                    columnDefs: [{ targets: [4], className: 'text-center' }],
                    buttons: ['pageLength'],
                    "data": categorias,
                    "columns": [
                        { data: "idcategoria" },
                        { data: "descricao" },
                        { data: "spDestaque" },
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
                    $("div.dataTables_wrapper div.dataTables_filter input").attr('placeholder', 'Pesquise as categorias aqui...');
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

    adicionar: (dados) => {

        // chama o método de adicionar
        app.metodos.post('/categoria', JSON.stringify(dados),
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
                    categoria.metodos.carregarCategorias();

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
        app.metodos.put('/categoria', JSON.stringify(dados),
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
                    categoria.metodos.carregarCategorias();
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

        categoria.metodos.limparCampos();
        EDICAO = true;

        // abre a modal
        $("#modalForm").modal('show');

        // chama o método de obter por id
        app.metodos.get('/categoria/' + id,
            (response) => {

                var categoria = response[0];

                // passa as informações para os campos
                $("#hdfCategoriaId").val(categoria.idcategoria);
                $("#txtDescricao").val(categoria.descricao);

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

        var idcategoria = $("#hdfCategoriaId").val();

        if (idcategoria != undefined && idcategoria != '') {

            var dados = {
                idcategoria: idcategoria,
                ativo: ativar
            }

            // chama o método de ativar / desativar
            app.metodos.post('/categoria/ativar', JSON.stringify(dados),
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
                        categoria.metodos.carregarCategorias();
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
        var descricao = $("#txtDescricao").val().trim();
        var idcategoria = $("#hdfCategoriaId").val();

        if (descricao == '' || descricao == undefined) {
            app.metodos.mensagem("Informe a descrição, por favor.");
            $("#txtDescricao").focus();
            return;
        }

        var dados = {
            idcategoria: idcategoria,
            descricao: descricao
        }

        if (EDICAO) {
            categoria.metodos.editar(dados);
        }
        else {
            categoria.metodos.adicionar(dados);
        }

    },

    abrirModal: () => {
        categoria.metodos.limparCampos();
        EDICAO = false;
    },

    abrirModalAtivar: (id, ativar) => {

        $("#hdfCategoriaId").val(id);

        if (ativar == 1) {
            $("#lblTituloModalAtivar").text('Ativar Categoria');
            $("#lblTextoConfirm").text('Deseja realmente ativar a categoria?');

            $("#btnAtivar").removeClass('hidden');
            $("#btnDesativar").addClass('hidden');
        }
        else {
            $("#lblTituloModalAtivar").text('Desativar Categoria');
            $("#lblTextoConfirm").text('Deseja realmente desativar a categoria?');

            $("#btnAtivar").addClass('hidden');
            $("#btnDesativar").removeClass('hidden');
        }

        $("#modalAtivar").modal('toggle');

    },

    abrirModalDestacar: (id, destacar) => {

        $("#hdfCategoriaId").val(id);

        if (destacar == 1) {
            $("#lblTituloModalDestacar").text('Destacar Categoria');
            $("#lblTextoConfirm").text('Deseja realmente destacar a categoria como principal?');

            $("#btnDestacar").removeClass('hidden');
            $("#btnRemoverDestaque").addClass('hidden');
        }
        else {
            $("#lblTituloModalDestacar").text('Remover Destaque Categoria');
            $("#lblTextoConfirm").text('Deseja realmente remover o destaque da categoria?');

            $("#btnDestacar").addClass('hidden');
            $("#btnRemoverDestaque").removeClass('hidden');
        }

        $("#modalDestacar").modal('toggle');

    },

    destacar: (destacar) => {

        var idcategoria = $("#hdfCategoriaId").val();

        if (idcategoria != undefined && idcategoria != '') {

            var dados = {
                idcategoria: idcategoria,
                destaque: destacar
            }

            // chama o método de destacar / remover destaque
            app.metodos.post('/categoria/destacar', JSON.stringify(dados),
                (response) => {

                    if (response.resultado == "erro") {
                        app.metodos.mensagem(response.msg);
                        console.log("Erro interno: ", response.ex);
                        return;
                    }

                    if (response.resultado == "sucesso") {
                        app.metodos.mensagem(response.msg, 'green');
                        $("#modalDestacar").modal('toggle');

                        // recarrega a tabela
                        categoria.metodos.carregarCategorias();
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
    
    limparCampos: () => {
        $("#txtDescricao").val('');
        $("#hdfCategoriaId").val('');
    },    

}

categoria.templates = {

    tabela: `<table id="tblCategorias" class="table table-sm table-nowrap card-table">
                <thead>
                    <tr>
                        <th class="text-muted">ID</th>
                        <th class="text-muted">Descrição</th>
                        <th class="text-muted">Destaque Menu</th>
                        <th class="text-muted">Ativa</th>
                        <th colspan="2" class="text-muted text-center">Ações</th>
                    </tr>
                </thead>
            </table>`

}