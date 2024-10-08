import Editor from './classes/Editor.js'
import Jogo from './classes/Jogo.js'

document.addEventListener('DOMContentLoaded', async () => {
    new Editor().desenhaCores()
    window.jogo = new Jogo()
    await jogo.inicia()
})
