export const log = texto => {
    console.log(texto);
}

export const getContext = () => {
    return document.getElementById('canvas').getContext('2d');
}

export const executaQuandoPronto = (callback) => {
    document.addEventListener('DOMContentLoaded', (event) => {callback()});
}



