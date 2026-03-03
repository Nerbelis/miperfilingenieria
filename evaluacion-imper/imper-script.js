/**
 * SOFTWARE PROFESIONAL DE IMPERMEABILIZACIÓN
 * Versión 3.0 - Verificación de llaves completa
 */

// 1. FUNCIÓN PARA GENERAR EL REPORTE
function generarReporte() {
    const areaInput = document.getElementById('area');
    const cuerpoTabla = document.getElementById('cuerpo-tabla');
    const reporteDiv = document.getElementById('reporte');
    const seccionPagos = document.getElementById('seccion-pagos');
    //Al final de generarReporte()
     reporteDiv.style.display = "block"; // Muestra el reporte (aunque esté borroso)
     reporteDiv.style.filter = "blur(8px)"; // Lo pone borroso
     seccionPagos.style.display = "block"; // Muestra PayPal y Pago Móvil claritos
     seccionPagos.scrollIntoView({ behavior: 'smooth' }); // Te lleva a los botones

    // Validamos que los elementos existan
    if (!areaInput || !cuerpoTabla || !reporteDiv) {
        console.error("Faltan elementos en el HTML");
        return;
    }

    const area = parseFloat(areaInput.value);
    if (isNaN(area) || area <= 0) {
        alert("Por favor, ingrese un área válida.");
        return;
    }

    // Datos de los selectores
    const sustrato = document.getElementById('sustrato')?.value || "concreto";
    const espesor = document.getElementById('espesor')?.value || "3.2";
    const sistema = document.getElementById('sistema')?.value || "calor";

    // Cálculos
    const areaCalculada = (area * 1.15).toFixed(2);
    
    // Limpiar tabla
    cuerpoTabla.innerHTML = "";

    // Partidas
    let partidas = [
        {
            codigo: "E322.101",
            descripcion: "Preparación de superficie de " + sustrato.toUpperCase(),
            unidad: "m²",
            cantidad: area.toFixed(2)
        },
        {
            codigo: "E322.210",
            descripcion: "Imprimación asfáltica (Primer).",
            unidad: "m²",
            cantidad: area.toFixed(2)
        },
        {
            codigo: "E322.321",
            descripcion: "Manto asfáltico " + espesor + " mm sobre " + sustrato,
            unidad: "m²",
            cantidad: areaCalculada
        }
    ];

    if (sustrato === "zinc") {
        partidas.push({ codigo: "E329.500", descripcion: "Sellado de tornillería.", unidad: "Pto", cantidad: (area * 3).toFixed(0) });
    }

    partidas.push({ codigo: "MO-CIV", descripcion: "Mano de obra especializada.", unidad: "Global", cantidad: area.toFixed(2) });

    // Llenar tabla
    partidas.forEach(function(p) {
        let fila = cuerpoTabla.insertRow();
        fila.innerHTML = "<td>" + p.codigo + "</td><td>" + p.descripcion + "</td><td align='center'>" + p.unidad + "</td><td align='center'>" + p.cantidad + "</td>";
    });

    // Mostrar reporte
    reporteDiv.style.display = "block";
    if (seccionPagos) {
        seccionPagos.style.display = "block";
        seccionPagos.scrollIntoView({ behavior: 'smooth' });
    }
}

// 2. FUNCIÓN PARA MOSTRAR PAGO MÓVIL
function mostrarPagoMovil() {
    const qrDiv = document.getElementById('qr-container');
    if (qrDiv) {
        if (qrDiv.style.display === 'none') {
            qrDiv.style.display = 'block';
        } else {
            qrDiv.style.display = 'none';
        }
    }
}

// 3. FUNCIÓN PARA WHATSAPP
function enviarConfirmacionWA() {
    const msj = encodeURIComponent("Hola! Pago de $10 realizado para el Reporte. CIV: 310409.");
    window.open("https://wa.me/584246163113?text=" + msj, '_blank');
    liberarReporte();
}

// 4. FUNCIÓN PARA LIBERAR EL REPORTE
function liberarReporte() {
    const reporte = document.getElementById('reporte');
    const btnDescargar = document.getElementById('btn-descargar');
    const seccionPagos = document.getElementById('seccion-pagos');

    if (reporte) {
        reporte.classList.remove('efecto-borroso');
        reporte.style.filter = "none";
    }
    if (btnDescargar) {
        btnDescargar.style.display = "block";
    }
    if (seccionPagos) {
        seccionPagos.style.display = "none";
    }
}

// 5. INICIALIZACIÓN DE PAYPAL Y LLAVE MAESTRA
window.onload = function() {
    // Verificar si PayPal está cargado
    if (typeof paypal !== 'undefined') {
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({ purchase_units: [{ amount: { value: '10.00' } }] });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    alert('Pago exitoso, ' + details.payer.name.given_name);
                    liberarReporte();
                });
            }
        }).render('#paypal-button-container');
    }

    // Llave maestra: Ctrl + Shift + Z
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
            const areaInput = document.getElementById('area');
            if (areaInput && (areaInput.value === "" || areaInput.value <= 0)) {
                areaInput.value = 50;
                generarReporte();
            }
            liberarReporte();
            const btn = document.getElementById('btn-descargar');
            if (btn) {
                btn.innerText = "MODO ADMIN: IMPRIMIR";
                btn.style.backgroundColor = "#c0392b";
            }
        }
    });
};
document.getElementById('seccion-pagos').style.display = "block";