// JavaScript Document
//Objetos importantes del Canvas
var canvas = document.getElementById("juego");
var ctx = canvas.getContext("2d");

//Crear el objeto de la nave(JSON)
var nave = {
    x: 100,
    y: canvas.height - 100,
    width: 50,
    height: 50
};
// el objeto juego(JSON) que va a tener 2 posibles estados : ganaste o perdiste
var juego = {
    estado: "iniciando"
};

var teclado = {
};//Objeto JSON
var disparos = [];//Array que almacena los disparos


var enemigos = [];//Array q almacena los enemigos
//Definir variables para las imagenes
var fondo;

//Definir las funciones
function cargar()
{
    fondo = new Image();
    fondo.src = "Espacio.jpg";
    fondo.onload = function ()
    {
        var intervalo = window.setInterval(BucleFoto, 1000 / 55);
    };
}
function dibujarEnemigos() {

    for (var i in enemigos) {
        var enemigo = enemigos[i];
        ctx.save();
        if (enemigo.estado == "vivo")
            ctx.fillStyle = "red";//cambiar x imagen
        if (enemigo.estado == "muerto")
            ctx.fillStyle = "black";//cambiar por imagen
        ctx.fillRect(enemigo.x, enemigo.y, enemigo.width, enemigo.height);
    }
}
function dibujarFondo()
{
    ctx.drawImage(fondo, 0, 0);
}

function dibujarNave()
{
    ctx.save();//Guardar Informacion
    ctx.fillStyle = "white";//Color de la nave
    ctx.fillRect(nave.x, nave.y, nave.width, nave.height);//Dibuja la nave que ahora seria un cuadrado
    ctx.restore();//Restaura la informacion 

}

//Teclado[32] = true; 

function agregarEventos(elemento, nombreEvento, funcion)
{
    if (elemento.addEventListener)
    {
        elemento.addEventListener(nombreEvento, funcion, false);
    }
    else if (elemento.attachEvent)
    {
        elemento.attachEvent(nombreEvento, funcion);
    }
}

function agregarEventosTeclado()
{
    agregarEventos(document, "keydown", function (e)
    {
        //Se pone a true la tecla presionada
        teclado[e.keyCode] = true;
    });

    agregarEventos(document, "keyup", function (e)
    {
        //Se pone a falso la tecla que dejo de ser presionada
        teclado[e.keyCode] = false;
    });
}
function moverNave() {
    //Pulsamos a tecla izquierda del cursor que es la 37 en ASCII para mover la nave hacia la izq.
    if (teclado[37]) {

        nave.x = nave.x - 6;
        if (nave.x < 0)
            nave.x = 0;
    }
    //Pulsamos a tecla derecha del cursor que es la 39 en ASCII para mover la nave hacia la drch.
    if (teclado[39]) {
        var limite = canvas.width - nave.width;//límite es igual al ancho del canvas menos el ancho de la nave
        nave.x = nave.x + 6;
        if (nave.x > limite)
            nave.x = limite;// para que no se pase del límite de la derecha
    }

    if (teclado[32]) {//Disparamos con barra espaciadora
        if (!teclado.disparo) {//Realizamos estas condiciones para que no haga un disparo contínuo
            disparo();
            teclado.disparo = true;
        }

    }
    if (!teclado[32])
        teclado.disparo = false;
}

function actualizarEnemigos() {
    if (juego.estado == "iniciando") {
        for (var i = 0; i < 10; i++) {
            enemigos.push({
                x: 10 + (i * 50), //este i *50 nos marca el posicionamiento en línea de los enemigos separados equidistantemente
                y: 10,
                height: 40,
                width: 40,
                estado: "vivo",
                contador: 0

            });
        }
        juego.estado = "jugando";// aquí cometí el fallo de poner == y el juego se ralentizaba hasta pararse pues entraba en un bucle y consumía todos los recursos

    }
    for (var i in enemigos) {

        var enemigo = enemigos[i];
        if (!enemigo)
            continue; //Utilizamos "continue"(mala praxis) para no gastar memoria de más para cuando no esté el enemigo y así saltamos al paso siguiente y tb puede que no esté el enemigo cuando empecemos a filtrar aquellos que han sido disparados(muertos)
        if (enemigo && enemigo.estado == "vivo") {//si enemigo existe o está vivo vamos a moverlo
            enemigo.contador++;

            enemigo.x = enemigo.x + Math.sin(enemigo.contador * Math.PI / 90) * 5;//Con esta función seno y valores que le estamos introduciendo los enemigos tienen un movimiento que llega hasta el final del canvas y regresa(pero podemos jugar con los valores

        }

        if (enemigo && enemigo.estado == "colisionado") {
            enemigo.contador++;
            if (enemigo.contador >= 20) {// para que no desaparezcan instantaneamente
                enemigo.estado = "muerto";
                enemigo.contador = 0;


            }
        }


    }

    if (!enemigo) {
        juego.estado = "iniciando";
    }
    enemigos = enemigos.filter(function (enemigo) {
        if (enemigo && enemigo.estado != "muerto") {
            return true;
        }

        return false;
    });
}

function moverDisparos() {

    for (var i in disparos) {
        var disparo = disparos[i];
        disparo.y -= 2;//movemos el disparo para que vaya subiendo
    }
    disparos = disparos.filter(function (disparo) {
        return disparo.y > 0;// Esta función filter se encarga de eliminar del array los disparos cuya coordenada y haya superado el tope del canvas(para no consumir memoria)

    });
}

function disparo() {
    disparos.push({//agregamos con push un objeto JSON al array de disparos
        x: nave.x + 20, //la posición inicial del disparo es la pos.actual de la nave y agregamos 20 pq la coordenada x de la nave está en el extremo izq.del rectángulo que representa la nave
        y: nave.y - 10, //y -10 para que lo agregue digamos que en la punta superior de la nave
        width: 10,
        height: 30
    });
}

function dibujarDisparos() {
    ctx.save();
    ctx.fillStyle = "white";
    for (var i in disparos) {
        var disparo = disparos[i];
        ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height);//dibujamos el disparo como rectángulo
    }
    ctx.restore();
}

function colision(a, b) { //colision entre disparo y enemigo(a y b)-funcion booleana (si hay o no)
    var colision = false;
    if (b.x + b.width >= a.x && b.x < a.x + a.width) {//horizontal
        if (b.y + b.height >= a.y && b.y < a.y + a.height) {//vertical
            colision = true;
        }
    }
    if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
        if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
            colision = true;
        }
    }
    if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
        if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
            colision = true;
        }
    }

    return colision;
}
function verificarColision() {

    for (var i in disparos) {
        var disparo = disparos[i];
        for (j in enemigos) {
            var enemigo = enemigos[j];
            if (colision(disparo, enemigo)) {
                enemigo.estado = "colisionado";//hubo colisión; el objeto enemigo se queda quieto
                enemigo.contador = 0;
            }
        }
    }
}

function BucleFoto()
{
    dibujarFondo();
    dibujarDisparos();
    dibujarNave();
    moverNave();
    dibujarEnemigos();
    moverDisparos();
    verificarColision();
    actualizarEnemigos();
}

//Ejecutar las funciones
agregarEventosTeclado();
cargar();
