var CENARIO_INICIAL = 'tela1';
var INTERVALO_PROTETOR = 1200;
var TAMANHO_BLOCO = 5;
var TAMANHO_PIXEL = 4;
var CONTEXT = null;
var PROTETOR_DE_TELA = null;
var BLOCOS = [];

var NOME_CONSTRUCOES = [
    {'A': 'agua'},
    {'C': 'chao2'},
    {'N': 'chao1'},
    {'F': 'folha'},
    {'G': 'grama'},
    {'L': 'planta'},
    {'M': 'madeira'},
    {'O': 'ouro'},
    {'P': 'pedra'},
    {'R': 'rubi'},
    {'X': 'so_terra'},
    {'T': 'terra'},
    {'V': 'lava'},
    {'D': 'diamante'},
    {'E': 'neve'},
    {'K': 'gelo'},
    {'B': 'tocha'},
];

var NOME_JOGADORES = [
    {'^': 'luffy_a'},
    {'#': 'luffy_b'},
]

var NOME_LETRAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var CORES = {
    '█': '#000000',
    'G': '#7CFC00',
    'g': '#00C02A',
    'N': '#8B5A2B',
    'P': '#504F54',
    'p': '#777777',
    'O': '#FFCA00',
    'M': '#462912',
    'm': '#825326',
    'F': '#234200',
    'f': '#3F7500',
    'R': '#A00000',
    'L': '#25D400',
    'l': '#1CA300',
    't': '#8B5A2B',
    'A': '#250092',
    'a': '#2E00B7',
    'V': '#FF1300',
    'v': '#FF6A00',
    'D': '#07D0FF',
    'I': '#FFFFFF',
    'K': '#56B2FF',
    'k': '#B9DFFF',
    'b': '#F60600',
};

function log(texto){
    console.log(texto);
}

function carregaBlocos() {
    var promises = []

    NOME_CONSTRUCOES.forEach(item => {
        promises.push(carregaBloco('construcoes', item));
    });

    NOME_JOGADORES.forEach(item => {
        promises.push(carregaBloco('jogadores', item));
    });

    NOME_LETRAS.forEach(item => {
        var itemObj = {}
        itemObj[item] = item
        promises.push(carregaBloco('letras', itemObj));
    });

    Promise.all(promises).then(promise => {
        log("Todas as promises foram resolvidas");
        comecaJogo();
    });
}

function carregaBloco(pasta, item) {
    var codigo = Object.keys(item)[0];
    var arquivo = Object.values(item)[0]

    var url = 'blocos/' + pasta + "/" + arquivo +'.txt';
    var promise = fetch(url);

    promise.then(response => response.text()).then(bloco => {
        log('Bloco ' + codigo + ' carregado.');
        BLOCOS[codigo] = bloco;
    })

    return promise;
}

function achaContext() {
    log('Encontrando context...');
    return document.getElementById('canvas').getContext('2d');
}

function comecaJogo() {
    log('Começando jogo...');
    CONTEXT = achaContext();
    carregaCenario(CENARIO_INICIAL);
}

function carregaCenario(cenario) {
    CONTEXT.clearRect(0, 0, 1000, 1000)
    fetch('cenarios/' + cenario + '.txt').then(response => {
        return response.text();
      }).then(cenario => {

        var l = 0;
        var c = 0;
        for (let x = 0; x < cenario.length; x++) {
            var bloco = cenario[x];

            if (bloco != '\n' && bloco != ' ') {
                desenhaBloco(BLOCOS[bloco], c, l);
            }

            if (bloco == '\n') {
                l++;
                c=0;
            } else {
                c++;
            }
        }
      })
}

function desenhaBloco(bloco, x, y) {
    var l = 0;
    var c = 0;
    for (var p = 0; p < bloco.length; p++) {
        var pixel = bloco[p];

        var pixelX = (x * TAMANHO_BLOCO * TAMANHO_PIXEL) + (c * TAMANHO_PIXEL);
        var pixelY = (y * TAMANHO_BLOCO * TAMANHO_PIXEL) + (l * TAMANHO_PIXEL);

         var cor = CORES[pixel];
         if (cor) {
            desenhaPixel(cor, pixelX, pixelY);
         }

        if (pixel == '\n') {
            l++;
            c=0;
        } else {
            c++;
        }
    }
}

function desenhaPixel(cor, x, y) {
    CONTEXT.fillStyle = cor;
    CONTEXT.fillRect(x, y, TAMANHO_PIXEL, TAMANHO_PIXEL);
}

function sorteiaCenario() {
    var n = Math.random();
    if (n > 0.75) {
        carregaCenario('tela1');
    } else if (n > 0.50) {
        carregaCenario('sarah');
    } else if (n > 0.25) {
        carregaCenario('dani');
    } else {
        carregaCenario('rafael');
    }
}

function iniciarProtetorDeTela() {
    PROTETOR_DE_TELA = setInterval(sorteiaCenario, INTERVALO_PROTETOR);
}

function pararProtetorDeTela() {
    clearInterval(PROTETOR_DE_TELA);
}

document.addEventListener('DOMContentLoaded', (event) => {
    carregaBlocos();
});




