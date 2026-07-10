// Configuración de tu Google Sheets (Mantén tu URL aquí)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiWIiiYa_LY5lf9wAYy-bskQaOo5TlSSHyNvD7-r3QvxUElNmQauh_LUr2kuGj2Ys3rw/exec';

// Función para cargar la tasa del BCV automáticamente
function obtenerTasaBCV() {
    var urlTasa = 'https://ve.dolarapi.com/v1/dolares/oficial';

    fetch(urlTasa)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data && data.promedio) {
                var inputTasa = document.getElementById('tasaBCV');
                inputTasa.value = data.promedio;
                calcular(); // Calcula el total automáticamente al cargar la tasa
            }
        })
        .catch(function(err) { console.log('Error cargando tasa: ' + err); });
}

// Función principal de cálculo
function calcular() {
    // Obtenemos los valores de los IDs del HTML
    var montoInput = document.getElementById('montoUSD').value;
    var tasaInput = document.getElementById('tasaBCV').value;

    var monto = parseFloat(montoInput) || 0;
    var tasa = parseFloat(tasaInput) || 0;

    // Lógica NVR: Comisión PayPal (5.4% + 0.30) + Tu Ganancia (11%)
    var costoPaypal = (monto * 0.054) + (monto > 0 ? 0.30 : 0);
    var gananciaNvr = monto * 0.11;
    
    // Cálculo de montos finales
    var netoUSD = monto - costoPaypal - gananciaNvr;
    var totalVES = netoUSD > 0 ? netoUSD * tasa : 0;

    // MOSTRAR RESULTADOS EN LA INTERFAZ
    
    // 1. Mostrar Neto en Dólares
    var displayUSD = document.getElementById('netoUSDDisplay');
    if (displayUSD) {
        displayUSD.innerText = (netoUSD > 0 ? netoUSD : 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' USD';
    }

    // 2. Mostrar Total en Bolívares
    var displayVES = document.getElementById('totalVES');
    if (displayVES) {
        displayVES.innerText = totalVES.toLocaleString('es-VE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' VES';
    }
}

// Función para registrar en Excel y enviar a WhatsApp
function registrarYEnviar() {
    var monto = document.getElementById('montoUSD').value;
    var tasa = document.getElementById('tasaBCV').value;
    var recibir = document.getElementById('totalVES').innerText;
    var recibirUSD = document.getElementById('netoUSDDisplay').innerText;

    if (parseFloat(monto) <= 0 || !monto) {
        return alert('Por favor, ingresa un monto válido.');
    }

    var datos = {
        monto: monto,
        tasa: tasa,
        ganancia: (parseFloat(monto) * 0.06).toFixed(2),
        total: recibir
    };

    // Envío a Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    // Mensaje de WhatsApp mejorado con el neto en USD
    var texto = 'NVR_exchange: Envío de $' + monto + ' USD.recibe neto: ' + recibirUSD + ' que equivalen a: ' + recibir;
    var urlWA = 'https://wa.me/16452040526?text=' + encodeURIComponent(texto);
    
    window.open(urlWA, '_blank');
}

// Ejecutar al abrir la página
window.onload = obtenerTasaBCV;