// funcoes
import { log, log2 } from './ferramentas.js';

// classes
import Editor from './classes/Editor.js'

// constantes
import NOME_CONSTRUCOES from './nomes/construcoes.js';
import NOME_JOGADORES from './nomes/jogadores.js';
import NOME_LETRAS from './nomes/letras.js';
import CORES from './nomes/cores.js';
import SPRITES from './nomes/sprites.js';
import {
    CENARIO_INICIAL,
    INTERVALO_REFRESH,
    TAMANHO_BLOCO,
    TAMANHO_PIXEL,
    NUMERO_DE_SPRITES
} from './configuracoes.js';

// variaveis
let CONTEXT = null;
let TIMER_REFRESH = null;
let BLOCOS = [];
let SPRITE_ATUAL = 0;

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

document.addEventListener('DOMContentLoaded', (event) => {
    Editor.desenhaCores(CORES)
    carregaBlocos()
});

