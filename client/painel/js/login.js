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
        var email = $("#txtEmail").val().trim();
        var senha = $("#txtSenha").val().trim();

        if (email == '' || email == undefined) {
            app.metodos.mensagem("Informe o e-mail, por favor.")
            $("#txtEmail").focus();
            return;
        }

        if (!app.metodos.isEmail(email)) {
            app.metodos.mensagem("Informe um e-mail válido, por favor.")
            $("#txtEmail").focus();
            return;
        }

        if (senha == '' || senha == undefined) {
            app.metodos.mensagem("Informe a senha, por favor.");
            $("#txtSenha").focus();
            return;
        }

        var dados = {
            email: email,
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

                    app.metodos.gravarValorSessao(response.TokenAcesso, "token")
                    app.metodos.gravarValorSessao(response.Nome, "NomeUsuario")
                    app.metodos.gravarValorSessao(response.Email, "Email")

                    window.location.href = '/painel/home/index.html';

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