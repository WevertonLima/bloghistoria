$(document).ready(function () {
    home.eventos.init();
})

var home = {};

home.eventos = {

    init: () => {

        // carrega a master page (barra de menus)
        $('#master').load('/painel/master/menu.html');
        
        setTimeout(() => {
            $(".main-content").removeClass('hidden');
        }, 200);

    }

}

home.metodos = {



}