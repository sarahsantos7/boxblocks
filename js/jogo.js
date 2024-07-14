var SIZE = 8;

function criaBloco(context, cor, x, y) {
    context.fillStyle = cor;
    context.fillRect(x, y, SIZE, SIZE);
}

function carregaCenario(context) {
    fetch('cenarios/tela1.txt').then(response => {
        return response.text();
      }).then(cenario => {

        let l = 0;
        let c = 0;
        for (let x = 0; x < cenario.length; x++) {
            let bloco = cenario[x];

            if (bloco == 'G') {
                criaBloco(context, "#7CFC00", c * SIZE, l * SIZE);
            } else if (bloco == 'N') {
                criaBloco(context, "#8B5A2B", c * SIZE, l * SIZE);
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

document.addEventListener('DOMContentLoaded', (event) => {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    console.log('1')
    carregaCenario(context);
});



