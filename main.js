let palavras = JSON.parse(localStorage.getItem('palavras')) || [];
let tentativasUsadas = 0;
let letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
let palavraSecreta, palavraOculta;
let jogando;

function iniciarJogo() {
    if (palavras.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Nenhuma palavra disponível',
            text: 'Por favor, adicione palavras antes de iniciar o jogo.'
        });
        return;
    }

    let botoes = document.getElementById('botoes');
    botoes.innerHTML = '';
    letras.forEach((value) => {
        botoes.innerHTML += `<button id='btn-${value}' class="btn btn-outline-dark m-1" onclick="checarLetra('${value}')">${value}</button>`;
    });
    
    jogando = true;
    tentativasUsadas = 0;

    palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];
    palavraOculta = '_ '.repeat(palavraSecreta.length).trim();

    document.querySelector('h2').innerHTML = palavraOculta;
    desenharForca();
    document.getElementById('btnReiniciar').classList.add('d-none');
}

function checarLetra(letra) {
    if (!jogando) return;
    let btn = document.getElementById('btn-' + letra);
    let achou = false;

    for (let i = 0; i < palavraSecreta.length; i++) {
        if (palavraSecreta[i] === letra.toLowerCase()) {
            achou = true;
            palavraOculta = trocaLetra(palavraOculta, letra, i);
        }
    }

    document.querySelector('h2').innerHTML = palavraOculta;
    btn.classList.remove('btn-outline-dark');
    btn.classList.add(achou ? 'btn-primary' : 'btn-danger');
    if (!achou) {
        tentativasUsadas++;
        desenharForca();
    }
    checarJogo();
}

function checarJogo() {
    if (tentativasUsadas === 6) {
        Swal.fire({ icon: 'error', title: 'Oooooops...', text: 'Você perdeu!!!' });
        jogando = false;
        document.getElementById('btnReiniciar').classList.remove('d-none');
    }
    if (palavraSecreta === palavraOculta.replace(/ /g, '').toLowerCase()) {
        Swal.fire({ icon: 'success', title: 'Aeeeeeee...', text: 'Você ganhou!!!' });
        jogando = false;
        document.getElementById('btnReiniciar').classList.remove('d-none');
    }
}

function trocaLetra(textoOriginal, letra, posicao) {
    let listaTexto = textoOriginal.split(" ");
    listaTexto[posicao] = letra;
    return listaTexto.join(" ");
}

function desenharForca() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 6;

    // Base da Forca
    ctx.beginPath();
    ctx.strokeStyle = '#006700';
    ctx.moveTo(20, canvas.height - 10);
    ctx.lineTo(180, canvas.height - 10);
    ctx.stroke();

    // Poste da Forca
    ctx.beginPath();
    ctx.strokeStyle = '#4e2708';
    ctx.moveTo(60, canvas.height - 10);
    ctx.lineTo(60, 20);
    ctx.stroke();

    // Trave
    ctx.beginPath();
    ctx.strokeStyle = '#4e2708';
    ctx.moveTo(60, 20);
    ctx.lineTo(120, 20);
    ctx.stroke();

    // Corda
    ctx.beginPath();
    ctx.moveTo(120, 20);
    ctx.lineTo(120, 30);
    ctx.stroke();

    // Diagonal
    ctx.beginPath();
    ctx.moveTo(80, 20);
    ctx.lineTo(60, 40);
    ctx.stroke();

    // Cabeça
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    if (tentativasUsadas >= 1) {
        ctx.beginPath();
        ctx.arc(120, 45, 15, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Corpo
    if (tentativasUsadas >= 2) {
        ctx.beginPath();
        ctx.moveTo(120, 60);
        ctx.lineTo(120, 120);
        ctx.stroke();
    }

    // Braço esquerdo
    if (tentativasUsadas >= 3) {
        ctx.beginPath();
        ctx.moveTo(120, 70);
        ctx.lineTo(100, 100);
        ctx.stroke();
    }

    // Braço direito
    if (tentativasUsadas >= 4) {
        ctx.beginPath();
        ctx.moveTo(120, 70);
        ctx.lineTo(140, 100);
        ctx.stroke();
    }

    // Perna esquerda
    if (tentativasUsadas >= 5) {
        ctx.beginPath();
        ctx.moveTo(120, 120);
        ctx.lineTo(100, 150);
        ctx.stroke();
    }

    // Perna direita
    if (tentativasUsadas >= 6) {
        ctx.beginPath();
        ctx.moveTo(120, 120);
        ctx.lineTo(140, 150);
        ctx.stroke();
    }
}

function adicionarPalavra() {
    Swal.fire({
        title: 'Adicionar Palavra',
        input: 'text',
        inputPlaceholder: 'Digite a nova palavra',
        showCancelButton: true,
        confirmButtonText: 'Adicionar',
        cancelButtonText: 'Cancelar',
        preConfirm: (palavra) => {
            if (!palavra) {
                Swal.showValidationMessage('Por favor, insira uma palavra');
            } else if (palavras.includes(palavra.toLowerCase())) {
                Swal.showValidationMessage('Essa palavra já existe');
            } else {
                palavras.push(palavra.toLowerCase());
                localStorage.setItem('palavras', JSON.stringify(palavras));
                Swal.fire('Palavra adicionada!', '', 'success');

                // Inicia o jogo automaticamente após adicionar a palavra
                iniciarJogo();
            }
        }
    });
}

function limparPalavras() {
    palavras = [];
    localStorage.removeItem('palavras');
    Swal.fire('Todas as palavras foram removidas!', '', 'success');
}

// Adicione o evento ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const adicionarButton = document.createElement('button');
    adicionarButton.classList.add('btn', 'btn-secondary', 'mb-3');
    adicionarButton.textContent = 'Adicionar Palavra';
    adicionarButton.onclick = adicionarPalavra;
    container.appendChild(adicionarButton);
    
    const limparButton = document.createElement('button');
    limparButton.classList.add('btn', 'btn-danger', 'mb-3');
    limparButton.textContent = 'Limpar Palavras';
    limparButton.onclick = limparPalavras;
    container.appendChild(limparButton);
});
