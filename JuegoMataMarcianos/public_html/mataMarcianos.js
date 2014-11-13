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
}

var ceclado = {
	
}

//Definir variables para las imagenes
var fondo;

//Definir las funciones
function Cargar()
{
	fondo = new Image();
	fondo.src = "Espacio.jpg";
	fondo.onload = function()
	{
		var intervalo = window.setInterval(BucleFoto, 1000/55);
	}
}

function DibujarFondo()
{
	ctx.drawImage(fondo, 0, 0);
}

function DibujarNave()
{
	ctx.save();//Guardar Informacion
	ctx.fillStyle = "white";//Color de la nave
	ctx.fillRect(nave.x, nave.y, nave.width, nave.height);//Dibuja la nave que ahora seria un cuadrado
	ctx.Restore();//Restaura la informacion 
	
}

//Teclado[32] = true; 

function AgregarEventos(elemento, nombreEvento, funcion)
{
	if(elemento.addEventListener)
	{
		elemento.addEventListener(nombreEvento, funcion, false);
	}
	else if(elemento.attachEvent)
	{
		elemento.attachEvent(nombreEvento, funcion);
	}
}

function AgregarEventosTeclado()
{
	AgregarEventos(document, "keydown", function(e)
	{
		//Se pone a true la tecla presionada
		teclado[e.keyCode] = true;
	});
	
	AgregarEventos(document, "keyup", function(e)
	{
		//Se pone a falso la tecla que dejo de ser presionada
		teclado[e.keyCode] = false;
	});
}

function BucleFoto()
{
	DibujarFondo();
	DibujarNave();
}

//Ejecutar las funciones
AgregarEventosTeclado();
Cargar();
