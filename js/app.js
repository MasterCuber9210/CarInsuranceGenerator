
// constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year  = year;
    this.tipo  = tipo;
}

// Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function() {
    /*
        1 = Americano 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
    */
    
    let cantidad;
    const base = 2000;
    
    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
    
        default:
            break;
    }

    // Leer el anio
    const diferencia = new Date().getFullYear() - this.year;

    //  cada anio de diferencia hace que la cantidad disminuya en un 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*
        Si el seguro es basico se multiplica por un 30% mas
        Si el seguro es completo se multiplica por un 50% mas
    */

    if (this.tipo === 'basico') {
        cantidad *= 1.3;
    } else {
        cantidad *= 1.5;
    }

    return cantidad;
}

function UI() {
    
}

// generar las opciones de los year
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
          min = max - 20;
    
    const selectYear = document.querySelector('#year');

    for (let i = max; i > min; i--) {
        const option = document.createElement('option');
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

// muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    
    const div = document.createElement('div');

    if (tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');

    div.textContent = mensaje;

    // insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (seguro, total) => {

    // Crear el resutado
    const div = document.createElement('div');
    div.classList.add('mt-10')
    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Total: <span class="font-normal"> $ ${total} </span></p>
    `;
    
    const resultadoDiv = document.querySelector('#resultado');
    setTimeout(() => {
        resultadoDiv.appendChild(div);
    }, 3000);

    // Mostrar el spinner
    const spinner = document.querySelector('#cargando');

    spinner.classList.remove('hidden');
    setTimeout(() => {
        spinner.classList.add('hidden') ;
    }, 3000);

}

// instanciar UI

const ui = new UI();


// Eventos

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();
})

eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}


// funciones
function cotizarSeguro(e) {
    e.preventDefault();

    // leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    
    // leer el year
    const year = document.querySelector('#year').value;

    // leer el tipo de seguro
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if (marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('Cotizando...', 'exito');    

    // limpiar los resultados previos

    const resultados = document.querySelector('#resultado div');
    if (resultados != null) {
        resultados.remove();
    }

    // instancia el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    // Utilizar el protoype que va a cotizar

    ui.mostrarResultado(seguro, total);

}
