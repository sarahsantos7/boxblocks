const log = texto => console.log(texto);
const log2 = texto => document.querySelector("#log").innerHTML = texto;

export { log, log2 }