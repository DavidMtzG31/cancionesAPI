const formulario = document.getElementById('formulario');

const cancion = document.getElementById('cancion');

formulario.addEventListener('submit', validaExtrae);

function validaExtrae(e) {
	e.preventDefault();
	if(cancion.value === '') {
		alerta('Introduce un término para búsqueda');
		return;
	}
	consultarAPI(cancion.value);
}


function consultarAPI(cancion) {

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
	if (JSON.stringify(datos)=='{}') {
		alerta('No hay resultados');
		return;
	}
	const objPrincipal = datos.tracks.hits;
	console.log(objPrincipal);

	objPrincipal.forEach(cancion => {
		const { track } = cancion;
		const { title, subtitle, coverarthq, share } = track;
		const { href } = share;
	
		console.log(`Esta canción se llama ${title}, interpretada por ${subtitle} y puedes escuchar una preview en ${href}`);

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


function alerta(mensaje) {
	Swal.fire({
		icon: 'warning',
		title: mensaje,
		showConfirmButton: false,
		timer: 1500
	  })
}