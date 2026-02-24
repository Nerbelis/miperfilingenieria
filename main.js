const datosNerbelis = {
    nombre: "Nerbelis C. Valdeblanques de Romero",
    titulo: "Civil and Informatics Engineer",
    ubicacion: "Maracaibo, Venezuela",
    biografia: "Apasionada por construir soluciones robustas y escalables.",
    habilidades: ["AutoCAD", "Structural Design", "Python", "Web Development", "JavaScript"]
};

function cargarPerfil() {
    // Aquí el # busca el id="nombre" de tu HTML
    function cargarPerfil() {
    // Corregimos la ruta a los datos (debe ser datosNerbelis.nombre, etc.)
    document.querySelector('#nombre').textContent = datosNerbelis.nombre;
    document.querySelector('#titulo-sub').textContent = datosNerbelis.titulo;
    document.querySelector('#bio').textContent = datosNerbelis.biografia;

    const lista = document.querySelector('#lista-habilidades');
    lista.innerHTML = '';

    datosNerbelis.habilidades.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = skill;
        lista.appendChild(span);
    });
}

    const lista = document.querySelector('#lista-habilidades');
    lista.innerHTML = ''; 

    datosNerbelis.habilidades.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = skill;
        lista.appendChild(span);
    });
}

window.onload = cargarPerfil;