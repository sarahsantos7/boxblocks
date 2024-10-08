import Carregador from './Carregador.js'
import CORES from '../nomes/cores.js'
import SPRITES from '../nomes/sprites.js'
import { log, getContext } from '../ferramentas.js'
import {
    CENARIO_INICIAL,
    INTERVALO_REFRESH,
    TAMANHO_BLOCO,
    TAMANHO_PIXEL,
    NUMERO_DE_SPRITES
} from '../configuracoes.js'

class Jogo {

    constructor(){
        this.context = getContext()
        this.timerRefresh = null
        this.spriteAtual = 0
        this.blocos = []
    }

    async inicia(){
        let carregador = new Carregador()
        this.blocos = await carregador.carregaBlocos()
        this.comecaJogo()
    }

    comecaJogo() {
        log('Começando jogo...')
        this.carregaCenario(CENARIO_INICIAL)
    }

    carregaCenario(cenario) {
        if (this.timerRefresh) {
            clearInterval(this.timerRefresh)
        }
        this.context.clearRect(0, 0, 1000, 1000)

        fetch('cenarios/' + cenario + '.txt').then(response => {
            return response.text()
          }).then(cenario => {
            this.refresh(cenario)
            this.timerRefresh = setInterval(() => { this.refresh(cenario) }, INTERVALO_REFRESH)
          })
    }

    refresh(cenario) {
        this.context.clearRect(0, 0, 1000, 1000)
        this.spriteAtual++
        if (this.spriteAtual > NUMERO_DE_SPRITES) {
            this.spriteAtual = 1
        }

        let linhas = cenario.split("\n")
        let l = 0
        linhas.forEach(linha => {
            this.carregaLinha(linha, l)
            l++
        })
    }

    carregaLinha(linha, l) {
        for (var c = 0; c < linha.length; c++) {
            var bloco = linha[c]
            if (bloco != ' ') {
                if (SPRITES.includes(bloco)) {
                    bloco = bloco + this.spriteAtual
                }
                var blocoAchado = this.blocos[bloco]
                if (blocoAchado) {
                    this.desenhaBloco(blocoAchado, c, l)
                } else {
                    log("Não consegui encontrar o bloco " + bloco + ". Linha: " + linha + ". Coluna: " + c)
                }
            }
        }
    }

    desenhaBloco(bloco, x, y) {
        let l = 0
        let c = 0
        for (let p = 0; p < bloco.length; p++) {
            let pixel = bloco[p]

            let pixelX = (x * TAMANHO_BLOCO * TAMANHO_PIXEL) + (c * TAMANHO_PIXEL)
            let pixelY = (y * TAMANHO_BLOCO * TAMANHO_PIXEL) + (l * TAMANHO_PIXEL)

            let cor = CORES[pixel]
            if (cor) {
                this.desenhaPixel(cor, pixelX, pixelY)
            }

            if (pixel == '\n') {
                l++
                c=0
            } else {
                c++
            }
        }
    }

    desenhaPixel(cor, x, y) {
        this.context.fillStyle = cor
        this.context.fillRect(x, y, TAMANHO_PIXEL, TAMANHO_PIXEL)
    }

}

export default Jogo
