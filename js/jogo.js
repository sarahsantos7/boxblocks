var CENARIO_INICIAL = 'sarah';
var INTERVALO_PROTETOR = 1200;
var INTERVALO_REFRESH = 300;
var TAMANHO_BLOCO = 9;
var TAMANHO_PIXEL = 3;
var CONTEXT = null;
var TIMER_REFRESH = null;
var PROTETOR_DE_TELA = null;
var BLOCOS = [];
var SPRITE_ATUAL = 0;
var NUMERO_DE_SPRITES = 4;

var NOME_CONSTRUCOES = [
    {'A1': 'agua1'},
    {'A2': 'agua2'},
    {'A3': 'agua1'},
    {'A4': 'agua2'},
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
    {'V1': 'lava1'},
    {'V2': 'lava1'},
    {'V3': 'lava2'},
    {'V4': 'lava2'},
    {'D': 'diamante'},
    {'E': 'neve'},
    {'K': 'gelo'},
    {'B': 'tocha'},
];

var NOME_JOGADORES = [
    {'^1': 'luffy_cima1'},
    {'^2': 'luffy_cima1'},
    {'^3': 'luffy_cima1'},
    {'^4': 'luffy_cima2'},
    {'#1': 'luffy_baixo1'},
    {'#2': 'luffy_baixo1'},
    {'#3': 'luffy_baixo1'},
    {'#4': 'luffy_baixo2'},
    {'*': 'tony'},
    {'+': 'tony2'},
    {'&': 'robin_cima'},
    {'$': 'robin_baixo'},
    {'%1': 'robin_mao1'},
    {'%2': 'robin_mao2'},
    {'%3': 'robin_mao3'},
    {'%4': 'robin_mao4'},
]

var SPRITES = ['^', '#', 'V', 'A','%']

var NOME_LETRAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var CORES = {
    'R': '#A00000',
    'b': '#F60600',
    'V': '#FF1300',
    'v': '#FF6A00',
    'O': '#FFCA00',
    'G': '#7CFC00',
    'g': '#00C02A',
    'L': '#25D400',
    'l': '#1CA300',
    'f': '#3F7500',
    'F': '#234200',
    'A': '#250092',
    'a': '#2E00B7',
    'K': '#56B2FF',
    'D': '#07D0FF',
    'k': '#B9DFFF',
    'I': '#FFFFFF',
    '█': '#000000',
    'N': '#8B5A2B',
    'P': '#504F54',
    'p': '#777777',
    'M': '#462912',
    'm': '#825326',
    't': '#8B5A2B',
    'B': '#FFEAA9',
    'X': '#4C0F54',
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
    var codigo = Object.keys(item)[0]
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
    if (TIMER_REFRESH) {
        clearInterval(TIMER_REFRESH)
    }

    CONTEXT.clearRect(0, 0, 1000, 1000)
    fetch('cenarios/' + cenario + '.txt').then(response => {
        return response.text();
      }).then(cenario => {
        refresh(cenario)
        TIMER_REFRESH = setInterval(() => { refresh(cenario) }, INTERVALO_REFRESH)
      })
}

function refresh(cenario) {
    CONTEXT.clearRect(0, 0, 1000, 1000)
    SPRITE_ATUAL++;
    if (SPRITE_ATUAL > NUMERO_DE_SPRITES) {
        SPRITE_ATUAL = 1
    }

    var linhas = cenario.split("\n")
    var l = 0
    linhas.forEach(linha => {
        carregaLinha(linha, l)
        l++
    });
}

function carregaLinha(linha, l) {
    for (var c = 0; c < linha.length; c++) {
        var bloco = linha[c]
        if (bloco != ' ') {
            if (SPRITES.includes(bloco)) {
                bloco = bloco + SPRITE_ATUAL
            }
            var blocoAchado = BLOCOS[bloco];
            if (blocoAchado) {
                desenhaBloco(blocoAchado, c, l);
            } else {
                log("Não consegui encontrar o bloco " + bloco + ". Linha: " + linha + ". Coluna: " + c);
            }
        }
    }
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

function desenhaCores(){
    var divCores = document.getElementById("cores")
    var size = 40
    var html = ""

    Object.keys(CORES).forEach(cor => {
        html += "<div style='display: inline-block; text-align: center; height: " + size + "px; width: " + size + "px; background-color: " + CORES[cor]  + "'> " + cor + "&nbsp;</div>"
    });

    divCores.innerHTML = html
}

document.addEventListener('DOMContentLoaded', (event) => {
    desenhaCores()
    carregaBlocos()
});




