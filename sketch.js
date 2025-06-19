
let caminhao;
let fazenda, mercado;
let produto;
let obstaculos = [];
let pontuacao = 0; Jogo: Agrinho - A Conexão Campo-Cidade

let caminhao;
let fazenda, mercado;
let produto;

let obstaculos = [];
let pontuacao = 0;
let estadoJogo = 'BUSCANDO';
let gameOver = false;
const QTD_OBSTACULOS = 8;
const LARGURA_ESTRADA = 250;
function setup() {
  createCanvas(800, 600);
  iniciarJogo();
}
function iniciarJogo() {
  gameOver = false;
  pontuacao = 0;
  estadoJogo = 'BUSCANDO';
  caminhao = {
    x: width / 2,
    y: height / 2,
    largura: 60,
    altura: 35,
    velocidade: 4,
    corpoCor: color(50, 100, 255),
    cabineCor: color(150, 180, 255)
  };
  fazenda = { x: 100, y: 80, tamanho: 80, cor: color(139, 69, 19) }; // Marrom
  mercado = { x: width - 100, y: height - 80, tamanho: 80, cor: color(220, 20, 60) }; // Vermelho
  produto = {
    x: fazenda.x,
    y: fazenda.y,
    tamanho: 20,
    cor: color(255, 223, 0),
    coletado: false
  };
  obstaculos = [];
  for(let i = 0; i < QTD_OBSTACULOS; i++) {
    obstaculos.push(criarObstaculo());
  }
  loop(); 
}
function criarObstaculo() {
    return {
        x: random(width),
        y: random(height / 2 - LARGURA_ESTRADA / 2, height / 2 + LARGURA_ESTRADA / 2),
        largura: random(40, 70),
        altura: 25,
        velocidade: random(1, 4) * (random() > 0.5 ? 1 : -1), 
        cor: color(random(100, 200), random(100, 200), random(100, 200))
    };
}
function draw() {
  if(gameOver) {
    mostrarTelaGameOver();
    return;
  }
  desenharCenario();
  desenharUI();
  moverCaminhao();
  desenharCaminhao();
  desenharDestinos();
  if (!produto.coletado) {
    desenharProduto();
  }
  moverObstaculos();
  desenharObstaculos();
  verificarColisoes();
}
function desenharCenario() {
  background(34, 139, 34);
  fill(128, 128, 128);
  noStroke();
  rect(0, height / 2 + LARGURA_ESTRADA / 2, width, height);
 
  fill(50, 50, 50);
  rect(0, height / 2 - LARGURA_ESTRADA / 2, width, LARGURA_ESTRADA);
}
function desenharUI() {
  fill(255);
  textSize(28);
  textAlign(LEFT, TOP);
  text(`Entregas: ${pontuacao}`, 20, 20);
  let instrucao = "";
  if (estadoJogo === 'BUSCANDO') {
    instrucao = "Vá para a FAZENDA no campo para coletar os produtos!";
  } else {
    instrucao = "Leve os produtos para o MERCADO na cidade!";
  }
  textAlign(CENTER, TOP);
  textSize(20);
  fill(255, 255, 0);
  text(instrucao, width / 2, 10);
}
function moverCaminhao() {
  if (keyIsDown(LEFT_ARROW)) caminhao.x -= caminhao.velocidade;
  if (keyIsDown(RIGHT_ARROW)) caminhao.x += caminhao.velocidade;
  if (keyIsDown(UP_ARROW)) caminhao.y -= caminhao.velocidade;
  if (keyIsDown(DOWN_ARROW)) caminhao.y += caminhao.velocidade;
  caminhao.x = constrain(caminhao.x, 0, width - caminhao.largura);
  caminhao.y = constrain(caminhao.y, 0, height - caminhao.altura);
}
function desenharCaminhao() {
  fill(caminhao.corpoCor);
  noStroke();
  rect(caminhao.x, caminhao.y, caminhao.largura, caminhao.altura, 5);
  fill(caminhao.cabineCor);
  rect(caminhao.x + caminhao.largura * 0.6, caminhao.y, caminhao.largura * 0.4, caminhao.altura, 5);
  if(produto.coletado) {
    fill(produto.cor);
    ellipse(caminhao.x + 20, caminhao.y + caminhao.altura / 2, produto.tamanho);
  }
}

function desenharDestinos() {
  fill(fazenda.cor);
  ellipse(fazenda.x, fazenda.y, fazenda.tamanho);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text("FAZENDA", fazenda.x, fazenda.y);
 
  fill(mercado.cor);
  ellipse(mercado.x, mercado.y, mercado.tamanho);
  fill(255);
  textAlign(CENTER, CENTER);
  text("MERCADO", mercado.x, mercado.y);
}

function desenharProduto() {
    fill(produto.cor);
    stroke(255);
    strokeWeight(2);
    ellipse(produto.x, produto.y, produto.tamanho);
    strokeWeight(1);
    noStroke();
}

function moverObstaculos() {
    for(let obs of obstaculos) {
        obs.x += obs.velocidade;
        if(obs.x > width + obs.largura) {
            obs.x = -obs.largura;
        } else if (obs.x < -obs.largura) {
            obs.x = width + obs.largura;
        }
    }
}

function desenharObstaculos() {
    for(let obs of obstaculos) {
        fill(obs.cor);
        noStroke();
        rect(obs.x, obs.y, obs.largura, obs.altura, 5);
    }
}

function verificarColisoes() {
 
  for (let obs of obstaculos) {
    if (collideRectRect(caminhao.x, caminhao.y, caminhao.largura, caminhao.altura, obs.x, obs.y, obs.largura, obs.altura)) {
      gameOver = true;
      noLoop();
    }
  }

  
  if (estadoJogo === 'BUSCANDO' && dist(caminhao.x, caminhao.y, fazenda.x, fazenda.y) < caminhao.largura / 2 + fazenda.tamanho / 2) {
    estadoJogo = 'ENTREGANDO';
    produto.coletado = true;
  }

  
  if (estadoJogo === 'ENTREGANDO' && dist(caminhao.x, caminhao.y, mercado.x, mercado.y) < caminhao.largura / 2 + mercado.tamanho / 2) {
    estadoJogo = 'BUSCANDO';
    produto.coletado = false;
    pontuacao++;
  }
}

function mostrarTelaGameOver() {
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(60);
    text("GAME OVER", width / 2, height / 2 - 50);

    fill(255);
    textSize(24);
    text(`Você fez ${pontuacao} entregas.`, width / 2, height / 2 + 20);
    text("Pressione 'R' para tentar novamente.", width / 2, height / 2 + 60);
}

function collideRectRect(x, y, w, h, x2, y2, w2, h2) {
  return x < x2 + w2 && x + w > x2 && y < y2 + h2 && y + h > y2;
}


function keyPressed() {
    if(gameOver && (key === 'r' || key === 'R')) 
        iniciarJogo()

let estadoJogo = 'BUSCANDO';
let gameOver = false;


const QTD_OBSTACULOS = 8;
const LARGURA_ESTRADA = 250;


function setup() {
  createCanvas(800, 600);
  iniciarJogo();
}


function iniciarJogo() {
  gameOver = false;
  pontuacao = 0;
  estadoJogo = 'BUSCANDO';

  
  caminhao = {
    x: width / 2,
    y: height / 2,
    largura: 60,
    altura: 35,
    velocidade: 4,
    corpoCor: color(50, 100, 255),
    cabineCor: color(150, 180, 255)
  };

  
  fazenda = { x: 100, y: 80, tamanho: 80, cor: color(139, 69, 19) }; 
  mercado = { x: width - 100, y: height - 80, tamanho: 80, cor: color(220, 20, 60) };

  
  produto = {
    x: fazenda.x,
    y: fazenda.y,
    tamanho: 20,
    cor: color(255, 223, 0),
    coletado: false
  };

  
  obstaculos = [];
  for(let i = 0; i < QTD_OBSTACULOS; i++) {
    obstaculos.push(criarObstaculo());
  }

  loop(); 
}


function criarObstaculo() {
    return {
        x: random(width),
        y: random(height / 2 - LARGURA_ESTRADA / 2, height / 2 + LARGURA_ESTRADA / 2),
        largura: random(40, 70),
        altura: 25,
        velocidade: random(1, 4) * (random() > 0.5 ? 1 : -1), 
        cor: color(random(100, 200), random(100, 200), random(100, 200))
    };
}


function draw() {
  if(gameOver) {
    mostrarTelaGameOver();
    return;
  }

  desenharCenario();
  desenharUI();

  moverCaminhao();
  desenharCaminhao();

  desenharDestinos();
  if (!produto.coletado) {
    desenharProduto();
  }

  moverObstaculos();
  desenharObstaculos();

  verificarColisoes();
}

function desenharCenario() {
  
  background(34, 139, 34);
 
  fill(128, 128, 128);
  noStroke();
  rect(0, height / 2 + LARGURA_ESTRADA / 2, width, height);
  
  fill(50, 50, 50);
  rect(0, height / 2 - LARGURA_ESTRADA / 2, width, LARGURA_ESTRADA);
}

function desenharUI() {
  
  fill(255);
  textSize(28);
  textAlign(LEFT, TOP);
  text(`Entregas: ${pontuacao}`, 20, 20);

 
  let instrucao = "";
  if (estadoJogo === 'BUSCANDO') {
    instrucao = "Vá para a FAZENDA no campo para coletar os produtos!";
  } else {
    instrucao = "Leve os produtos para o MERCADO na cidade!";
  }
  textAlign(CENTER, TOP);
  textSize(20);
  fill(255, 255, 0);
  text(instrucao, width / 2, 10);
}

function moverCaminhao() {
  if (keyIsDown(LEFT_ARROW)) caminhao.x -= caminhao.velocidade;
  if (keyIsDown(RIGHT_ARROW)) caminhao.x += caminhao.velocidade;
  if (keyIsDown(UP_ARROW)) caminhao.y -= caminhao.velocidade;
  if (keyIsDown(DOWN_ARROW)) caminhao.y += caminhao.velocidade;
  caminhao.x = constrain(caminhao.x, 0, width - caminhao.largura);
  caminhao.y = constrain(caminhao.y, 0, height - caminhao.altura);
}

function desenharCaminhao() {
  
  fill(caminhao.corpoCor);
  noStroke();
  rect(caminhao.x, caminhao.y, caminhao.largura, caminhao.altura, 5);
  // Cabine
  fill(caminhao.cabineCor);
  rect(caminhao.x + caminhao.largura * 0.6, caminhao.y, caminhao.largura * 0.4, caminhao.altura, 5);
  
  if(produto.coletado) {
    fill(produto.cor);
    ellipse(caminhao.x + 20, caminhao.y + caminhao.altura / 2, produto.tamanho);
  }
}

function desenharDestinos() {
  fill(fazenda.cor);
  ellipse(fazenda.x, fazenda.y, fazenda.tamanho);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text("FAZENDA", fazenda.x, fazenda.y);
 
  fill(mercado.cor);
  ellipse(mercado.x, mercado.y, mercado.tamanho);
  fill(255);
  textAlign(CENTER, CENTER);
  text("MERCADO", mercado.x, mercado.y);
}

function desenharProduto() {
    fill(produto.cor);
    stroke(255);
    strokeWeight(2);
    ellipse(produto.x, produto.y, produto.tamanho);
    strokeWeight(1);
    noStroke();
}

function moverObstaculos() {
    for(let obs of obstaculos) {
        obs.x += obs.velocidade;
        if(obs.x > width + obs.largura) {
            obs.x = -obs.largura;
        } else if (obs.x < -obs.largura) {
            obs.x = width + obs.largura;
        }
    }
}

function desenharObstaculos() {
    for(let obs of obstaculos) {
        fill(obs.cor);
        noStroke();
        rect(obs.x, obs.y, obs.largura, obs.altura, 5);
    }
}

function verificarColisoes() {
  for (let obs of obstaculos) {
    if (collideRectRect(caminhao.x, caminhao.y, caminhao.largura, caminhao.altura, obs.x, obs.y, obs.largura, obs.altura)) {
      gameOver = true;
      noLoop();
    }
  }
  if (estadoJogo === 'BUSCANDO' && dist(caminhao.x, caminhao.y, fazenda.x, fazenda.y) < caminhao.largura / 2 + fazenda.tamanho / 2) {
    estadoJogo = 'ENTREGANDO';
    produto.coletado = true;
  }

  
  if (estadoJogo === 'ENTREGANDO' && dist(caminhao.x, caminhao.y, mercado.x, mercado.y) < caminhao.largura / 2 + mercado.tamanho / 2) {
    estadoJogo = 'BUSCANDO';
    produto.coletado = false;
    pontuacao++;
  }
}

function mostrarTelaGameOver() {
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(60);
    text("GAME OVER", width / 2, height / 2 - 50);

    fill(255);
    textSize(24);
    text(`Você fez ${pontuacao} entregas.`, width / 2, height / 2 + 20);
    text("Pressione 'R' para tentar novamente.", width / 2, height / 2 + 60);
}


function collideRectRect(x, y, w, h, x2, y2, w2, h2) {
  return x < x2 + w2 && x + w > x2 && y < y2 + h2 && y + h > y2;
}


function keyPressed() {
    if(gameOver && (key === 'r' || key === 'R')) {
        iniciarJogo();
    }