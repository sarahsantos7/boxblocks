function criaBloco(context, cor, x, y) {
    context.fillStyle = cor;
    context.fillRect(x, y, 10, 10);
}

function carregaCenario() {
    fetch('cenarios/tela1.txt').then(response => { response.text(); })
        .then(data => {
            console.log(data);
        })
}

document.addEventListener('DOMContentLoaded', (event) => {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    carregaCenario();

    criaBloco(context, "#FF0000", 100, 200);
    criaBloco(context, "#0FFFF0", 10, 20);
});



