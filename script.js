const mycanvas = document.getElementById('myCanvas');
const ctx = mycanvas.getContext('2d');

let bombas = []
let obstaculos = []
let pared = []

const tamano = 40;
let x = 0;
let y = 0;
let velocidad = tamano;
let direccion = "";

const filas = mycanvas.height / tamano;
const columnas = mycanvas.width / tamano;
const fondo = new Image();
fondo.src = "fondo.jpg";
const jugadorImg = new Image();
jugadorImg.src = "Bob.webp";
const paredImg = new Image();
paredImg.src = "pared.webp";

class Rectangulo {
    constructor(x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;
    }

    seTocan(otro) {
        return this.x < otro.x + otro.w &&
            this.x + this.w > otro.x &&
            this.y < otro.y + otro.h &&
            this.y + this.h > otro.y;
    }
}

let jugador = new Rectangulo(x, y, tamano, tamano, jugadorImg);

function paredes() {

    const wallSpacing = tamano * 3; 
    const wallSize = tamano;

    for (let x = 0; x < mycanvas.width; x += wallSpacing) {
        for (let y = 0; y < mycanvas.height; y += wallSpacing) {
           
            if (!(x === jugador.x && y === jugador.y)) {
                pared.push(new Rectangulo(x, y, wallSize, wallSize,paredImg));
            }
        }
    }

    obstaculos = obstaculosAleatorios(350, true);
}

function obstaculosAleatorios(contador, posJugador) {
    let posicion = [];
    while (posicion.length < contador) {
        let x = Math.floor(Math.random() * columnas) * tamano;
        let y = Math.floor(Math.random() * filas) * tamano;

        if (posJugador && (x === jugador.x && y === jugador.y || posPared(x, y))) {
            continue;
        }

        if (!posicion.some(pos => pos.x === x && pos.y === y)) {
            posicion.push({ x, y, size: tamano });
        }
    }
    return posicion;
}

function posPared(x, y) {
    for (let i = 0; i < pared.length; i++) {
        if (x === pared[i].x && y === pared[i].y) {
            return true;
        }
    }
    return false;
}




document.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
        case 87:
            jugador.y -= velocidad;
            if (jugador.y <= 0) {
                jugador.y = mycanvas.height;
            }
            direccion = "";
            break;
        case 83:
            jugador.y += velocidad;
            if (jugador.y >= mycanvas.height) {
                jugador.y = 0;
            }
            direccion = "";
            break;
        case 65:
            jugador.x -= velocidad;
            if (jugador.x <= 0) {
                jugador.x = mycanvas.width;
            }
            direccion = "";
            break;
        case 68:
            jugador.x += velocidad;
            if (jugador.x >= mycanvas.width) {
                jugador.x = 0;
            }
            direccion = "";
            break;
        case 32:
            // ponerBomba()
            break;
    }
});

function pintar() {
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
    ctx.drawImage(fondo, 0, 0, mycanvas.width, mycanvas.height);
   
    pared.forEach(pared => {
        ctx.drawImage(pared.c, pared.x, pared.y, pared.w, pared.h);
    });

    obstaculos.forEach(obstaculo => {
        ctx.fillStyle = "black"; 
        ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.size, obstaculo.size);
    });

    ctx.drawImage(jugador.c, jugador.x, jugador.y, jugador.w, jugador.h);



    requestAnimationFrame(pintar);
}
paredes();
pintar();
