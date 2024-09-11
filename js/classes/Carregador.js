import { log } from '../ferramentas.js';
import NOME_CONSTRUCOES from '../nomes/construcoes.js';
import NOME_JOGADORES from '../nomes/jogadores.js';
import NOME_LETRAS from '../nomes/letras.js';

class Carregador {

    constructor(){
        this.blocos = []
    }

    async carregaBlocos() {
        let promises = []

        NOME_CONSTRUCOES.forEach(item => {
            promises.push(this.carregaBloco('construcoes', item));
        });

        NOME_JOGADORES.forEach(item => {
            promises.push(this.carregaBloco('jogadores', item));
        });

        NOME_LETRAS.forEach(item => {
            let itemObj = {}
            itemObj[item] = item
            promises.push(this.carregaBloco('letras', itemObj));
        });

        await Promise.all(promises).then(promise => {
            log("Todas as promises foram resolvidas");
        });

        return this.blocos;
    }

    carregaBloco(pasta, item){
        let codigo = Object.keys(item)[0]
        let arquivo = Object.values(item)[0]

        var url = 'blocos/' + pasta + "/" + arquivo +'.txt';
        var promise = fetch(url);

        promise.then(response => response.text()).then(bloco => {
            this.blocos[codigo] = bloco;
        })

        return promise;
    }

}

export default Carregador