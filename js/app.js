const formulario = document.getElementById('formulario');
const cancion = document.getElementById('cancion');


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
		console.log(reproductor)

		const { href } = share;

		// Canción
		const resultado = document.getElementById('resultado');
		const divTexto= document.createElement('DIV');
		divTexto.innerHTML = `
		<br> <br> <p> Canción: ${title}   Interprete: ${subtitle}     <a href="${href}">Más información </a></p>
		`

		const divReproductor = document.createElement('DIV');

		const audio = document.createElement('AUDIO');
		audio.setAttribute('controls', true);

		const source = document.createElement('SOURCE');
		source.setAttribute('src', `${reproductor}`);
		source.setAttribute('type', "audio/mp3");
		source.setAttribute('preload', "auto");

		audio.appendChild(source);

		divReproductor.appendChild(audio);

		resultado.appendChild(divTexto);
		resultado.appendChild(divReproductor);
	});
}


// Tareas ajenas
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