$(document).ready(function () {
    login.eventos.init();
})

var login = {};

login.eventos = {

    init: () => {

        // valida se foi um logout sem google
        // var url = new URL(window.location.href);
        // var m = url.searchParams.get("m");
        // var g = url.searchParams.get("g");

        // if (m == 'logout' && g == '0') {
        //     console.log('remove url sem google')
        //     window.history.pushState('/login.html?m=logout&g=0', 'Acessar área ninja - Front.lee', '/login.html');
        // }

        $("#btnLogin").on('click', () => {
            login.metodos.validaLogin();
        })

        $("#btnCadastro").on('click', () => {
            $("#btnCadastro").addClass('disabled');
            login.metodos.cadastro();
        })

        $("#btnAlterarSenha").on('click', () => {
            $("#btnAlterarSenha").addClass('disabled');
            login.metodos.alterarSenha();
        })

        $("#btnRecuperar").on('click', () => {
            $("#btnRecuperar").addClass('disabled');
            login.metodos.recuperarSenha();
        })

    }

}

login.metodos = {

    login: (email, senha) => {

        var dados = {
            email: email,
            senha: senha
        }

        app.metodos.post('/login', JSON.stringify(dados),
            (response) => {
                console.log(response)

                if (response.status == 'error') {
                    alert(response.mensagem);
                    return;
                }

                if (response.status == "success") {

                    app.metodos.gravarValorSessao(response.TokenAcesso, "token")
                    app.metodos.gravarValorSessao(response.Nome, "NomeUsuario")
                    app.metodos.gravarValorSessao(response.Email, "Email")
                    app.metodos.gravarValorSessao(response.Avatar, "Avatar")
                    app.metodos.gravarValorSessao(response.GTK, "GTK")

                    window.location.reload();

                }

            },
            (xhr, ajaxOptions, error) => {
                console.log('xhr', xhr)
                console.log('ajaxOptions', ajaxOptions)
                console.log('error', error)
            }, true
        )

    },

    validaLogin: () => {

        let email = $("#txtEmailLogin").val().trim();
        let senha = $("#txtSenhaLogin").val().trim();

        if (email.length == 0 || !app.metodos.isEmail(email)) {
            alert("Informe o E-mail, por favor");
            $("#txtEmailLogin").focus();
            return;
        }

        if (senha.length == 0) {
            alert("Informe a Senha, por favor");
            $("#txtSenhaLogin").focus();
            return;
        }

        login.metodos.login(email, senha);

    },

    cadastro: () => {

        let nome = $("#txtNomeCadastro").val().trim();
        let email = $("#txtEmailCadastro").val().trim();
        let senha = $("#txtSenhaCadastro").val().trim();

        if (nome.length == 0) {
            alert("Informe o nome completo, por favor");
            $("#txtNomeCadastro").focus();
            $("#btnCadastro").removeClass('disabled')
            return;
        }

        if (email.length == 0 || !app.metodos.isEmail(email)) {
            alert("Informe um e-mail válido, por favor");
            $("#txtEmailCadastro").focus();
            $("#btnCadastro").removeClass('disabled')
            return;
        }

        if (senha.length == 0) {
            alert("Informe a senha, por favor");
            $("#txtSenhaCadastro").focus();
            $("#btnCadastro").removeClass('disabled')
            return;
        }

        let dados = {
            nome: nome,
            email: email,
            senha: senha
        }

        app.metodos.post('/usuario/cadastro', JSON.stringify(dados),
            (response) => {
                console.log('response', response)

                if (response.status == "error") {
                    alert(response.mensagem);
                }
                else if (response.status == "success") {
                    login.metodos.login(email, senha);
                }

                $("#btnCadastro").removeClass('disabled')

            },
            (xhr, ajaxOptions, error) => {
                console.log('xhr', xhr)
                console.log('ajaxOptions', ajaxOptions)
                console.log('error', error)
            }, true
        )

    },

    alterarSenha: () => {

        let senha = $("#txtSenhaAtual").val().trim();
        let novaSenha = $("#txtNovaSenha").val().trim();
        let confirmaSenha = $("#txtConfirmaSenha").val().trim();

        if (senha.length == 0) {
            alert("Informe a senha atual, por favor");
            $("#txtSenhaAtual").focus();
            $("#btnAlterarSenha").removeClass('disabled')
            return;
        }

        if (novaSenha.length == 0) {
            alert("Informe a nova senha, por favor");
            $("#txtNovaSenha").focus();
            $("#btnAlterarSenha").removeClass('disabled')
            return;
        }

        if (confirmaSenha.length == 0) {
            alert("Repita a nova senha, por favor");
            $("#txtConfirmaSenha").focus();
            $("#btnAlterarSenha").removeClass('disabled')
            return;
        }

        if (novaSenha != confirmaSenha) {
            alert("As senhas não conferem");
            $("#txtConfirmaSenha").focus();
            $("#btnAlterarSenha").removeClass('disabled')
            return;
        }

        let dados = {
            senha: senha,
            novaSenha: novaSenha
        }

        app.metodos.post('/usuario/alterarSenha', JSON.stringify(dados),
            (response) => {
                console.log('response', response)

                if (response.status == "error") {
                    alert(response.mensagem);
                }
                else if (response.status == "success") {
                    alert(response.mensagem);
                    $("#modalAlterarSenha").modal('hide')
                }

                $("#btnAlterarSenha").removeClass('disabled')

            },
            (xhr, ajaxOptions, error) => {
                console.log('xhr', xhr)
                console.log('ajaxOptions', ajaxOptions)
                console.log('error', error)
            }, true
        )

    },

    openModalalterarSenha: () => {

        $("#txtSenhaAtual").val('');
        $("#txtNovaSenha").val();
        $("#txtConfirmaSenha").val();

        $("#modalAlterarSenha").modal('show')

    },

    recuperarSenha: () => {

        let email = $("#txtEmailRecuperar").val().trim();

        if (email.length == 0 || !app.metodos.isEmail(email)) {
            alert("Informe um e-mail válido, por favor");
            $("#txtEmailRecuperar").focus();
            $("#btnRecuperar").removeClass('disabled')
            return;
        }

        let dados = {
            email: email,
        }

        app.metodos.post('/usuario/recuperarSenha', JSON.stringify(dados),
            (response) => {
                console.log('response', response)

                if (response.status == "error") {
                    alert(response.mensagem);
                }
                else if (response.status == "success") {
                    alert(response.mensagem);
                    $("#modalRecuperarSenha").modal('hide')
                }

                $("#btnRecuperar").removeClass('disabled')

            },
            (xhr, ajaxOptions, error) => {

                alert('Enviamos um e-mail com a nova senha!');
                $("#modalRecuperarSenha").modal('hide')

                $("#btnRecuperar").removeClass('disabled')

                console.log('xhr', xhr)
                console.log('ajaxOptions', ajaxOptions)
                console.log('error', error)
            }, true
        )

    }

    // loginGoogle: (access) => {

    //     app.metodos.post('/logingoogle', JSON.stringify(access),
    //         (response) => {
    //             console.log(response)

    //             if (response.status == 'error') {
    //                 app.metodos.mensagem(response.mensagem);
    //                 return;
    //             }

    //             if (response.status == "success") {

    //                 app.metodos.gravarValorSessao(response.TokenAcesso, "token")
    //                 app.metodos.gravarValorSessao(response.Nome, "NomeUsuario")
    //                 app.metodos.gravarValorSessao(response.Email, "Email")
    //                 app.metodos.gravarValorSessao(response.Avatar, "Avatar")
    //                 app.metodos.gravarValorSessao(response.GTK, "GTK")
    //                 app.metodos.gravarValorSessao(response.ConfirmouEmail, "EmailC")

    //                 window.location.href = '/painel/home.html';

    //             }

    //         },
    //         (xhr, ajaxOptions, error) => {
    //             console.log('xhr', xhr)
    //             console.log('ajaxOptions', ajaxOptions)
    //             console.log('error', error)
    //         }, true
    //     )

    // },

}