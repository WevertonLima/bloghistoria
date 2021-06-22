$(document).ready(function () {
    sobre.eventos.init();
})

var sobre = {};

var AUX_EDICAO = '';
var ID_SOBRE = 0

sobre.eventos = {

    init: () => {

        // carrega a master page (barra de menus)
        $('#master').load('/painel/master/menu.html');

        // carrega as informações
        sobre.metodos.carregarSobre();

        setTimeout(() => {
            $(".main-content").removeClass('hidden');
        }, 200);

        $("#menuSobre").parent('li').addClass('active')

    }

}

sobre.metodos = {

    carregarSobre: () => {

        // chama o método de carregar sobre
        app.metodos.get('/sobre',
            (response) => {

                var sobre = response[0];
                console.log(sobre);

                if (response.length == 0) {
                    ID_SOBRE = 0;
                    $("#txtDescAutor").val('');
                    $("#txtDescBlog").val('');
                    return;
                }

                if (sobre != undefined) {
                    ID_SOBRE = sobre.idsobre;
                    $("#txtDescAutor").val(sobre.descricaoautor);
                    $("#txtDescBlog").val(sobre.descricaoblog);
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

    salvarDados: () => {

        if (ID_SOBRE > 0) {

            var dados = {
                idsobre: ID_SOBRE,
                descricaoautor: $("#txtDescAutor").val().trim(),
                descricaoblog: $("#txtDescBlog").val().trim()
            }

            // chama o método de atualizar
            app.metodos.put('/sobre', JSON.stringify(dados),
                (response) => {

                    console.log(response);

                    if (response.resultado == "erro") {
                        app.metodos.mensagem(response.msg);
                        console.log("Erro interno: ", response.ex);
                        return;
                    }

                    if (response.resultado == "sucesso") {
                        app.metodos.mensagem(response.msg, 'green');
                        $("#modalSalvarDados").modal('hide');
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

    }

}

