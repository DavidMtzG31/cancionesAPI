const formulario = document.getElementById('formulario');
const cancion = document.getElementById('cancion');



// let audio;

// document.addEventListener('DOMContentLoaded', () => {
// 	audio = document.getElementById('audio');
// 	console.log(audio);
// })

let playBtn;
let pauseBtn;
let stopBtn;


formulario.addEventListener('submit', validaExtrae);
function validaExtrae(e) {
	limpiarHTML();
	e.preventDefault();
	if(cancion.value === '') {
		alerta('Introduce un término para búsqueda');
		return;
	}
	consultarAPI(cancion.value);
}


function consultarAPI(cancion) {
	spinner();

	const url = `https://shazam.p.rapidapi.com/search?term=${cancion}&locale=en-US&offset=0&limit=5`;

	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'd49dd24016msh726f2c471aa02b9p10157fjsn7b6ac20e66f1',
			'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
		}
	};

	fetch(url , options)
		.then(respuesta => respuesta.json())
		.then(datos => procesaDatos(datos))
		.catch(err => console.error(err));
	}


function procesaDatos(datos) {
	limpiarHTML();
	if (JSON.stringify(datos)=='{}') {
		alerta('No hay resultados');
		return;
	}

	const objPrincipal = datos.tracks.hits;

	objPrincipal.forEach(cancion => {
		const { track } = cancion;
		const { title, subtitle, hub, share } = track;
		const {actions} = hub;
		const reproductor = actions[1].uri;
		// console.log(reproductor)

		const { href } = share;

		// Canción
		const resultado = document.getElementById('resultado');
		const divTexto= document.createElement('DIV');
		divTexto.innerHTML = `
		<br> <br> <p> La canción se llama ${title}, interpretada por ${subtitle}, y puedes escuchar una preview</p>
		`

		// Reproductor
		const divRep = document.createElement('DIV');
		divRep.setAttribute('id', 'reproductor');

		// Volumen
		const divVol = document.createElement('DIV');
		divVol.setAttribute('id', 'volumen');

		// Boton Play
		playBtn = document.createElement('button');
		playBtn.classList.add('play');
		playBtn.innerText = 'Play';
		playBtn.onclick = function() {
			play();
		};

		// Boton Pause
		pauseBtn = document.createElement('button');
		pauseBtn.classList.add('pause');
		pauseBtn.innerText = 'Pause';
		pauseBtn.onclick = function() {
			pause();
		};

		// Boton Stop
		stopBtn = document.createElement('button');
		stopBtn.classList.add('stop');
		stopBtn.innerText = 'Stop';
		stopBtn.onclick = function() {
			stop();
		};


		// Volumen
		const volBtn = document.createElement('P');
		const volInput = document.createElement('INPUT');
		volInput.setAttribute('value', '1')
		volInput.min = "0";
		volInput.max = "1";
		volInput.classList.add('not-visible');

		// Etiqueta Audio
		const divAudio = document.createElement('AUDIO');
		divAudio.setAttribute('id', 'audio');

		const divSrc = document.createElement('SOURCE')
		divSrc.src=`${reproductor}`;
		divSrc.setAttribute('type',"audio/mpeg")

		divAudio.appendChild(divSrc);
		

		divRep.appendChild(playBtn);
		divRep.appendChild(pauseBtn);
		divRep.appendChild(stopBtn);

		volBtn.appendChild(volInput)
		divVol.appendChild(volBtn);


		resultado.appendChild(divTexto);
		resultado.appendChild(divRep);
		resultado.appendChild(divVol);
		resultado.appendChild(divAudio);

	});
}


// Tareas ajenas

function play() {
	audio.play()
}

function pause() {
	audio.pause()
}

function stop() {
	audio.load()
}

function spinner() {
	const resultado = document.querySelector('#resultado');

	const div = document.createElement('DIV');
	div.classList.add('spinner');
	div.innerHTML = `
  		<div class="double-bounce1"></div>
  		<div class="double-bounce2"></div>
	`;
	resultado.appendChild(div)
}

function limpiarHTML() {
    const resultado = document.querySelector('#resultado');

    while( resultado.firstChild )
    resultado.removeChild(resultado.firstChild);
}

function alerta(mensaje) {
	Swal.fire({
		icon: 'warning',
		title: mensaje,
		showConfirmButton: false,
		timer: 1500
	  })
}