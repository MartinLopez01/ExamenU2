const mycanvas = document.getElementById('myCanvas');
const ctx = mycanvas.getContext('2d');

let bombas = [];
let obstaculos = [];
let pared = [];
let puntuacion = 0;
const tamano = 40;
let x = 40;
let y = 40;
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

function borde() {
    for (let x = 0; x < mycanvas.width; x += tamano) {
        
        pared.push(new Rectangulo(x, 0, tamano, tamano, paredImg));
      
        pared.push(new Rectangulo(x, mycanvas.height - tamano, tamano, tamano, paredImg));
    }

    
    for (let y = 0; y < mycanvas.height; y += tamano) {
        
        pared.push(new Rectangulo(0, y, tamano, tamano, paredImg));
       
        pared.push(new Rectangulo(mycanvas.width - tamano, y, tamano, tamano, paredImg));
    }

}

function paredes() {
    borde();
    const espacioPared = tamano * 3;
    const tamanoPared = tamano;

    for (let x = 0; x < mycanvas.width; x += espacioPared) {
        for (let y = 0; y < mycanvas.height; y += espacioPared) {
            if (!(x === jugador.x && y === jugador.y)) {
                pared.push(new Rectangulo(x, y, tamanoPared, tamanoPared, paredImg));
            }
        }
    }

    obstaculos = obstaculosAleatorios(300, true);
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

function ponerBomba() {
    bombas.push({
        x: jugador.x,
        y: jugador.y,
        timer: 3
    });
}


function explotarBomba(ponerUnaBomba) {
    let bomba = bombas[ponerUnaBomba];


    ctx.fillStyle = 'orange';
    ctx.fillRect(bomba.x - tamano, bomba.y, tamano * 3, tamano);


    ctx.fillRect(bomba.x, bomba.y - tamano, tamano, tamano * 3);


    obstaculos = obstaculos.filter(obstaculo => {
        if (verificarColision(obstaculo, bomba)) {
            puntuacion += 10;
            return false;
        }
        return true;
    });

    bombas.splice(ponerUnaBomba, 1);
}


function verificarColision(obstaculo, bomba) {

    let rangoExplosivo = {
        xMin: bomba.x - tamano,
        xMax: bomba.x + tamano * 2,
        yMin: bomba.y - tamano,
        yMax: bomba.y + tamano * 2
    };


    return (
        obstaculo.x < rangoExplosivo.xMax &&
        obstaculo.x + obstaculo.size > rangoExplosivo.xMin &&
        obstaculo.y < rangoExplosivo.yMax &&
        obstaculo.y + obstaculo.size > rangoExplosivo.yMin
    );
}

function puedeMover(x, y) {
    let jugadorTemp = new Rectangulo(x, y, jugador.w, jugador.h, jugador.c);


    for (let i = 0; i < pared.length; i++) {
        if (jugadorTemp.seTocan(pared[i])) {
            return false;
        }
    }

    for (let i = 0; i < obstaculos.length; i++) {
        if (jugadorTemp.seTocan(new Rectangulo(obstaculos[i].x, obstaculos[i].y, tamano, tamano))) {
            return false;
        }
    }

    return true;
}

document.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
        case 87:
            if (puedeMover(jugador.x, jugador.y - velocidad)) {
                jugador.y -= velocidad;
            }
            if (jugador.y <= 0) {
                jugador.y = mycanvas.height;
            }
            direccion = "";
            break;
        case 83:
            if (puedeMover(jugador.x, jugador.y + velocidad)) {
                jugador.y += velocidad;
            }
            if (jugador.y >= mycanvas.height) {
                jugador.y = 0;
            }
            direccion = "";
            break;
        case 65:
            if (puedeMover(jugador.x - velocidad, jugador.y)) {
                jugador.x -= velocidad;
            }
            if (jugador.x <= 0) {
                jugador.x = mycanvas.width;
            }
            direccion = "";
            break;
        case 68:
            if (puedeMover(jugador.x + velocidad, jugador.y)) {
                jugador.x += velocidad;
            }
            if (jugador.x >= mycanvas.width) {
                jugador.x = 0;
            }
            direccion = "";
            break;
        case 32:
            ponerBomba();
            break;
    }
});

function pintar() {
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
    ctx.drawImage(fondo, 0, 0, mycanvas.width, mycanvas.height);


   


    obstaculos.forEach(obstaculo => {
        ctx.fillStyle = "black";
        ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.size, obstaculo.size);
    });
 pared.forEach(pared => {
        ctx.drawImage(pared.c, pared.x, pared.y, pared.w, pared.h);
    });

    bombas.forEach(bomba => {
        ctx.fillStyle = "red";
        ctx.fillRect(bomba.x, bomba.y, tamano, tamano);


        bomba.timer -= 0.05;
        if (bomba.timer <= 0) {
            explotarBomba(bombas.indexOf(bomba));
        }
    });

    ctx.drawImage(jugador.c, jugador.x, jugador.y, jugador.w, jugador.h);

   

    requestAnimationFrame(pintar);
}

paredes();
pintar();
