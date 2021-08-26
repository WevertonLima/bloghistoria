$(document).ready(function () {
    home.eventos.init();
})

var home = {};

var CLIENT_ID = '467541054020-pvaandkfp21fto9fr1bg9pcoucsto99r.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAOhbuoACObvGqkDTMxsz7QCc8AwS_tafA';
var VIEW_ID = '249876892';

var LIST_ACESSOS = [];
var LISTA_RELATORIO_DATAS = [];
var LISTA_RELATORIO_ACESSOS = [];

var DATA_INICO = '';
var DATA_FINAL = '';

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

    loadGA: () => {

        home.metodos.GAauthenticate().then(home.metodos.GAloadClient());

    },

    obterAcessos: () => {

        //gera as datas para pesquisa (mês atual)

        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        // data Inicio
        let diaInicio = firstDay.getDate();
        let mesInicio = firstDay.getMonth() + 1;
        let anoInicio = firstDay.getFullYear();

        if (diaInicio < 10) { diaInicio = '0' + diaInicio }
        if (mesInicio < 10) { mesInicio = '0' + mesInicio }

        var _dataInicioAmericano = `${anoInicio}-${mesInicio}-${diaInicio}`;
        var _dataInicioBrasileiro = `${diaInicio}/${mesInicio}/${anoInicio}`;

        // data Final
        let diaFinal = lastDay.getDate();
        let mesFinal = lastDay.getMonth() + 1;
        let anoFinal = lastDay.getFullYear();

        if (diaFinal < 10) { diaFinal = '0' + diaFinal }
        if (mesFinal < 10) { mesFinal = '0' + mesFinal }

        var _dataFinalAmericano = `${anoFinal}-${mesFinal}-${diaFinal}`;
        var _dataFinalBrasileiro = `${diaFinal}/${mesFinal}/${anoFinal}`;

        DATA_INICO = _dataInicioBrasileiro;
        DATA_FINAL = _dataFinalBrasileiro;

        console.log(`Filtro de acessos de ${DATA_INICO} à ${DATA_FINAL}`);

        gapi.client.request({
            path: '/v4/reports:batchGet',
            root: 'https://analyticsreporting.googleapis.com/',
            method: 'POST',
            body: {
                reportRequests: [
                    {
                        viewId: VIEW_ID,
                        dateRanges: [
                            {
                                startDate: _dataInicioAmericano,
                                endDate: _dataFinalAmericano
                            }
                        ],
                        metrics: [
                            {
                                expression: "ga:pageviews"
                            }
                        ],
                        dimensions: [
                            {
                                name: "ga:date"
                            }
                        ]
                    }
                ]
            }
        })
            .then(function (response) {

                console.log("Response", response);

                if (response.result.reports[0].data.rows != undefined) {
                    home.metodos.gerarListaAcessos(response.result.reports[0].data.rows);
                }
                else {
                    console.log('Nenhum dado encontrado no período selecionado')
                }

            },
                function (err) { console.error("Execute error", err); });

    },

    gerarListaAcessos: (lista) => {

        $.each(lista, (i, e) => {

            let _data = e.dimensions[0];
            let _acessos = e.metrics[0].values[0];

            let _dataFinal = `${_data.substr(6, 2)}/${_data.substr(4, 2)}/${_data.substr(0, 4)}`;

            console.log('DATA: ', _dataFinal);
            console.log('ACESSOS: ', _acessos);

            console.log('\n\n');

            LIST_ACESSOS.push({
                data: _dataFinal,
                acessos: _acessos
            })

            if ((i + 1) == lista.length) {
                home.metodos.carregarDatas();
            }

        })

    },

    carregarDatas: () => {

        if (LIST_ACESSOS.length > 0) {

            let diffIni = parseInt(DATA_INICO.split('/')[0]);
            let diffFim = parseInt(DATA_FINAL.split('/')[0]);

            let diffDatas = diffFim - diffIni;

            console.log('Diferença das datas: ', diffDatas);

            // gera a lista de datas com valores

            for (var i = 1; i <= (diffDatas + 1); i++) {

                let newData = `${i < 10 ? ('0' + i) : i}/${DATA_INICO.split('/')[1]}/${DATA_INICO.split('/')[2]}`;
                console.log(newData);

                let acessos = 0;

                // valida se na data existem acessos
                let existe = $.grep(LIST_ACESSOS, (elem) => {
                    return elem.data == newData;
                })

                if (existe.length > 0) {
                    acessos = parseInt(existe[0].acessos);
                }

                LISTA_RELATORIO_DATAS.push(newData)
                LISTA_RELATORIO_ACESSOS.push(acessos)

                if (i == (diffDatas + 1)) {
                    home.metodos.carregarGrafico();
                }

            }

        }

    },

    carregarGrafico: () => {

        console.log('Carregando grafico')

        var ctx = document.getElementById('chartAcessos').getContext('2d');

        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: LISTA_RELATORIO_DATAS,
                datasets: [{
                    label: 'Total de Acessos',
                    data: LISTA_RELATORIO_ACESSOS,
                    backgroundColor: [
                        '#464ea0'
                    ],
                    borderColor: [
                        '#464ea0'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    },

    initCheckActiveUsers: () => {

        setInterval(() => {
            home.metodos.obterUsuariosAtivos();
        }, 10000);

        home.metodos.obterUsuariosAtivos();

    },

    obterUsuariosAtivos: () => {

        gapi.client.analytics.data.realtime.get({
            "ids": "ga:249876892",
            "metrics": "rt:activeUsers"
        })
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                //console.log("Response", response.result);

                if (response.result != undefined && response.result.totalsForAllResults["rt:activeUsers"] != undefined) {
                    //console.log('Uusários ativos: ', response.result.totalsForAllResults["rt:activeUsers"]);

                    $("#lblTotalUsuariosAtivos").text(response.result.totalsForAllResults["rt:activeUsers"]);

                }
                else {
                    $("#lblTotalUsuariosAtivos").text("0");
                    console.log('Falha ao obter usuários ativos.')
                }

            },
                function (err) { console.error("Execute error", err); });

    },

    GAauthenticate: () => {
        return gapi.auth2.getAuthInstance()
            .signIn({ scope: "https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly" })
            .then(function () { console.log("Sign-in successful"); },
                function (err) { console.error("Error signing in", err); });
    },

    GAloadClient: () => {
        gapi.client.setApiKey(API_KEY);
        return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/analytics/v3/rest")
            .then(function () { console.log("GAPI client loaded for API"); home.metodos.obterAcessos() },
                function (err) { console.error("Error loading GAPI client for API", err); });
    },

}