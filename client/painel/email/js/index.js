$(document).ready(function () {
    email.eventos.init();
})

var email = {};

var EDICAO = false;

email.eventos = {

    init: () => {

        // carrega a master page (barra de menus)
        $('#master').load('/painel/master/menu.html');

        // inicia a listagem dos e-mails
        email.metodos.carregarEmails();

        setTimeout(() => {
            $(".main-content").removeClass('hidden');
        }, 200);

        $("#menuEmail").parent('li').addClass('active')

    }

}


email.metodos = {

    carregarEmails: () => {

        // chama o método de carregar emails
        app.metodos.get('/emails',
            (response) => {

                var emails = response;

                console.log('emails', emails) 

                // adciona a coluna de ação nos registros

                console.log(emails);

                // recria a tabela de emails
                $("#containerTabela").html('');

                $("#containerTabela").append(email.templates.tabela);

                // cria a tabela
                $("#tblEmails").DataTable({
                    destroy: true,
                    aaSorting: [[0]],
                    dom: 'Bfrtipl',
                    lengthMenu: [[10, 25, 50, -1], ['10 linhas', '25 linhas', '50 linhas', 'Todas']],
                    //columnDefs: [{ targets: [3], className: 'text-center' }],
                    buttons: ['pageLength'],
                    "data": emails,
                    "columns": [
                        { data: "idemail" },
                        { data: "nome" },
                        { data: "emailusuario" }
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
                    $("div.dataTables_wrapper div.dataTables_filter input").attr('placeholder', 'Pesquise os e-mails aqui...');
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

    }  

}


email.templates = {

    tabela: `<table id="tblEmails" class="table table-sm table-nowrap card-table">
                <thead>
                    <tr>
                        <th class="text-muted">ID</th>
                        <th class="text-muted">Nome</th>
                        <th class="text-muted">E-mail</th>
                    </tr>
                </thead>
            </table>`

}