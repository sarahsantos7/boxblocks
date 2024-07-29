var TAMANHO_BLOCO = 5;
var TAMANHO_PIXEL = 4;
var CONTEXT = null;
var BLOCOS = [];
var CORES = {
    'G': '#7CFC00',
    'g': '#00C02A',
    'N': '#8B5A2B',
    'P': '#504F54',
    'p': '#777777',
    'O': '#FFDA00',
    'M': '#462912',
    'm': '#825326',
    'F': '#234200',
    'f': '#3F7500',
    'R': '#660300',

};

carregaBlocos();

function carregaBlocos() {
    carregaBloco("C");
    carregaBloco("G");
    carregaBloco("T");
    carregaBloco("P");
    carregaBloco("O");
    carregaBloco("M");
    carregaBloco("m");
    carregaBloco("F");
    carregaBloco("f");
    carregaBloco("R");
}

function carregaBloco(nome) {
    fetch('blocos/' + nome +'.txt').then(response => {
        return response.text();
    }).then(bloco => {
      BLOCOS[nome] = bloco;
    })
}


function achaContext() {
    return document.getElementById('canvas').getContext('2d');
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

document.addEventListener('DOMContentLoaded', (event) => {
    CONTEXT = achaContext();
    setTimeout(carregaCenario('sarah'), 200);
});




