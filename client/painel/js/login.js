$(document).ready(function () {
    login.eventos.init();
})

var login = {};

login.eventos = {

    init: () => {

        // cria o link dos eventos da página
        $("#btnLogin").on('click', () => {
            login.metodos.logar();
        });

    },

}

login.metodos = {

    logar: () => {

        // valida os campos
        var usuario = $("#txtUsuario").val().trim();
        var senha = $("#txtSenha").val().trim();

        if (usuario == '' || usuario == undefined) {
            app.metodos.mensagem("Informe o usuário, por favor.")
            $("#txtUsuario").focus();
            return;
        }

        if (senha == '' || senha == undefined) {
            app.metodos.mensagem("Informe a senha, por favor.");
            $("#txtSenha").focus();
            return;
        }

        var dados = {
            usuario: usuario,
            senha: senha
        }

        // chama o método de login
        app.metodos.post('/painel/login', JSON.stringify(dados),
            (response) => {

                console.log(response)

                if (response.status == 'error') {
                    app.metodos.mensagem(response.mensagem);
                    return;
                }

                if (response.status == "success") {

                    app.method.gravarValorSessao(response.TokenAcesso, "token")
                    app.method.gravarValorSessao(response.Nome, "NomeUsuario")
                    app.method.gravarValorSessao(response.Email, "Email")

                    window.location.href = '/painel/home.html';

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
}