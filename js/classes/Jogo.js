import Carregador from './classes/Carregador.js'

class Jogo {

    constructor(){
        this.blocos = []
    }

    inicia(){
        let carregador = new Carregador()
        //blocos = await carregador.carregaBlocos()
        comecaJogo()
    }

}

export default Jogo
