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
		.then(response => response.json())
		.then(response => procesaDatos(response))
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
		const { title, subtitle, coverarthq, share } = track;
		const { href } = share;

		const resultado = document.getElementById('resultado');
		const divFoto = document.createElement('DIV');
		const p = document.createElement('P');
		divFoto.innerHTML = `
		<p> La canción se llama ${title}, interpretada por ${subtitle}, y puedes escuchar una preview <a href="${href}" target="_blank">aquí</a> </p>
		`
		divFoto.appendChild(p);
		resultado.appendChild(divFoto);

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