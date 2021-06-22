$(document).ready(function () {
    tag.eventos.init();
})

var tag = {};

var EDICAO = false;

tag.eventos = {

    init: () => {

        // carrega a master page (barra de menus)
        $('#master').load('/painel/master/menu.html');

        // inicia a listagem das tags
        tag.metodos.carregarTags();

        $("#btnSalvar").on('click', () => {
            tag.metodos.validaFormulario();
        });

        setTimeout(() => {
            $(".main-content").removeClass('hidden');
        }, 200);

        $("#menuTag").parent('li').addClass('active')

    }

}


tag.metodos = {

    carregarTags: () => {

        // chama o método de carregar tags
        app.metodos.get('/tags',
            (response) => {

                var tags = response;

                console.log('tags', tags)

                // adciona a coluna de ação nos registros
                $.each(tags, (i, elem) => {
                    elem.Acoes = `<div class="dropdown">
                                    <a href="#" class="btn btn-sm btn-outline-secondary dropdown-ellipses dropdown-toggle" data-toggle="dropdown">
                                        Ações &nbsp<i class="fe fe-arrow-down"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <a href="#!" class="dropdown-item" onclick="tag.metodos.carregarEdicao(` + elem.idtag + `)">
                                            <i class="fe fe-edit"></i>&nbsp; Editar
                                        </a>
                                        {Opcao}
                                    </div>
                                </div>`;

                    let opcao = '';

                    if (elem.ativo > 0) {
                        opcao = `<a href="#!" class="dropdown-item" onclick="tag.metodos.abrirModalAtivar(` + elem.idtag + `, 0)">
                                    <i class="fe fe-disabled"></i>&nbsp; Desativar
                                </a>`;

                        elem.spAtivo = '<span class="badge badge-success">Sim</span>';
                    }
                    else {
                        opcao = `<a href="#!" class="dropdown-item" onclick="tag.metodos.abrirModalAtivar(` + elem.idtag + `, 1)">
                                    <i class="fe fe-check"></i>&nbsp; Ativar
                                </a>`;

                        elem.spAtivo = '<span class="badge badge-danger">Não</span>'
                    }

                    elem.Acoes = elem.Acoes.replace('{Opcao}', opcao);

                });

                console.log(tags);

                // recria a tabela de tags
                $("#containerTabela").html('');

                $("#containerTabela").append(tag.templates.tabela);

                // cria a tabela
                $("#tblTags").DataTable({
                    destroy: true,
                    aaSorting: [[2]],
                    dom: 'Bfrtipl',
                    lengthMenu: [[10, 25, 50, -1], ['10 linhas', '25 linhas', '50 linhas', 'Todas']],
                    columnDefs: [{ targets: [3], className: 'text-center' }],
                    buttons: ['pageLength'],
                    "data": tags,
                    "columns": [
                        { data: "idtag" },
                        { data: "descricao" },
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
                    $("div.dataTables_wrapper div.dataTables_filter input").attr('placeholder', 'Pesquise as tags aqui...');
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
        app.metodos.post('/tag', JSON.stringify(dados),
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
                    tag.metodos.carregarTags();

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
        app.metodos.put('/tag', JSON.stringify(dados),
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
                    tag.metodos.carregarTags();
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

        tag.metodos.limparCampos();
        EDICAO = true;

        // abre a modal
        $("#modalForm").modal('show');

        // chama o método de obter por id
        app.metodos.get('/tag/' + id,
            (response) => {

                var tag = response[0];

                // passa as informações para os campos
                $("#hdfTagId").val(tag.idtag);
                $("#txtDescricao").val(tag.descricao);

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

        var idtag = $("#hdfTagId").val();

        if (idtag != undefined && idtag != '') {

            var dados = {
                idtag: idtag,
                ativo: ativar
            }

            // chama o método de ativar / desativar
            app.metodos.post('/tag/ativar', JSON.stringify(dados),
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
                        tag.metodos.carregarTags();
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
        var idtag = $("#hdfTagId").val();

        if (descricao == '' || descricao == undefined) {
            app.metodos.mensagem("Informe a descrição, por favor.");
            $("#txtDescricao").focus();
            return;
        }

        var dados = {
            idtag: idtag,
            descricao: descricao
        }

        if (EDICAO) {
            tag.metodos.editar(dados);
        }
        else {
            tag.metodos.adicionar(dados);
        }

    },

    abrirModal: () => {
        tag.metodos.limparCampos();
        EDICAO = false;
    },

    abrirModalAtivar: (id, ativar) => {

        $("#hdfTagId").val(id);

        if (ativar == 1) {
            $("#lblTituloModalAtivar").text('Ativar Tag');
            $("#lblTextoConfirm").text('Deseja realmente ativar a tag?');

            $("#btnAtivar").removeClass('hidden');
            $("#btnDesativar").addClass('hidden');
        }
        else {
            $("#lblTituloModalAtivar").text('Desativar Tag');
            $("#lblTextoConfirm").text('Deseja realmente desativar a tag?');

            $("#btnAtivar").addClass('hidden');
            $("#btnDesativar").removeClass('hidden');
        }

        $("#modalAtivar").modal('toggle');

    },

    limparCampos: () => {
        $("#txtDescricao").val('');
        $("#hdfTagId").val('');
    },   

}


tag.templates = {

    tabela: `<table id="tblTags" class="table table-sm table-nowrap card-table">
                <thead>
                    <tr>
                        <th class="text-muted">ID</th>
                        <th class="text-muted">Descrição</th>
                        <th class="text-muted">Ativa</th>
                        <th colspan="2" class="text-muted text-center">Ações</th>
                    </tr>
                </thead>
            </table>`

}