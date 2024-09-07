import { log } from '../ferramentas.js';
import CORES from '../nomes/cores.js';

class Editor {

    desenhaCores() {
        const divCores = document.getElementById("cores")
        const size = 40

        let html = ""
        Object.keys(CORES).forEach(cor => {
            html += "<div style='display: inline-block; text-align: center; height: " + size + "px; width: " + size + "px; background-color: " + CORES[cor]  + "'> " + cor + "&nbsp;</div>"
        });

        divCores.innerHTML = html
    }

}

export default Editor