const mycanvas = document.getElementById('myCanvas');
const ctx = mycanvas.getContext('2d');

let bombas = []
let obstaculos = []
let walls = []

const tamano = 40;
let x = 0;
let y = 0;
let velocidad = 40;
let direccion = "";

const filas = mycanvas.height / tamano;
const columnas = mycanvas.width / tamano;
const fondo = new Image();
fondo.src = "fondo.jpg";
const jugadorImg = new Image();
jugadorImg.src = "Bob.webp";

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
    ctx.drawImage(jugador.c, jugador.x, jugador.y, jugador.w, jugador.h);

    

    requestAnimationFrame(pintar);
}

requestAnimationFrame(pintar);
