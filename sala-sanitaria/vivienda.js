// Variable de control de pago
let pagoConfirmado = false;

// --- PUERTA TRASERA (BACKDOOR) PRIVADA ---
document.addEventListener('keydown', function(event) {
    // Detecta Ctrl + Shift + X (en mayúscula o minúscula)
    if (event.ctrlKey && event.shiftKey && (event.key === 'X' || event.key === 'x')) {
        console.log("Acceso de desarrolladora detectado");
        alert("¡Acceso de Ingeniera Nerbelis Confirmado! Desbloqueando reporte...");
        desbloquearSistema();
    }
});

// Función de cálculo (Se activa con tu botón del HTML)
function calcularTodo() {
    try {
        // IDs verificados de tus fotos
        const area = parseFloat(document.getElementById('areaBano').value) || 0;
        const lav = parseInt(document.getElementById('cantLavamanos').value) || 0;
        const poc = parseInt(document.getElementById('cantPocetas').value) || 0;
        const duc = parseInt(document.getElementById('cantDuchas').value) || 0;

        const totalPiezas = lav + poc + duc;

        // Fórmulas técnicas según tus capturas
        const partidas = [
            { cod: "M-611.100", desc: "Tubería PVC-P 1/2\" (Red interna)", unid: "ML", cant: (area * 1.5) + (totalPiezas * 0.5), pu: 25.00 },
            { cod: "M-611.112", desc: "Puntos de aguas blancas", unid: "PTO", cant: totalPiezas, pu: 35.00 },
            { cod: "M-631.100", desc: "Tubería PVC-S 4\" y 2\" (Aguas negras)", unid: "ML", cant: (area * 1.2) + (poc * 1.5), pu: 18.00 },
            { cod: "M-631.111", desc: "Puntos de aguas negras (inc. centro piso)", unid: "PTO", cant: totalPiezas + 1, pu: 48.00 },
            { cod: "M-711.100", desc: "Suministro de piezas sanitarias", unid: "PZA", cant: totalPiezas, pu: 115.00 }
        ];

        dibujarTabla(partidas);

        // Mostrar el panel de resultados
        const panel = document.querySelector('.results-panel');
        if (panel) panel.style.display = 'block';

        // Si no ha pagado, mostrar PayPal
        if (!pagoConfirmado) {
            const areaPago = document.getElementById('area-pago');
            if (areaPago) areaPago.style.display = 'block';
        }

        actualizarFechaReporte();

    } catch (error) {
        console.error("Error en el cálculo:", error);
    }
}

// Dibuja la tabla de cómputos
function dibujarTabla(data) {
    const tabla = document.getElementById('listaPartidas');
    let subtotal = 0;
    if (!tabla) return;
    
    tabla.innerHTML = "";
    data.forEach(item => {
        let total = item.cant * item.pu;
        subtotal += total;
        tabla.innerHTML += `
            <tr>
                <td><strong>${item.cod}</strong></td>
                <td>${item.desc}</td>
                <td>${item.unid}</td>
                <td>${item.cant.toFixed(2)}</td>
                <td>${item.pu.toFixed(2)}</td>
                <td>${total.toFixed(2)}</td>
            </tr>`;
    });

    let iva = subtotal * 0.16;
    document.getElementById('subTotal').innerText = subtotal.toFixed(2);
    document.getElementById('ivaTotal').innerText = iva.toFixed(2);
    document.getElementById('montoFinal').innerText = (subtotal + iva).toFixed(2);
}

// Función que abre todo el sistema
function desbloquearSistema() {
    pagoConfirmado = true;
    
    // Quita el borroso
    const bloqueado = document.getElementById('contenedor-bloqueado');
    if (bloqueado) {
        bloqueado.classList.remove('modo-bloqueado');
        bloqueado.style.filter = "none";
        bloqueado.style.pointerEvents = "auto";
    }

    // Oculta el pago y muestra descarga
    const areaPago = document.getElementById('area-pago');
    const seccionDescarga = document.getElementById('seccion-descarga');
    
    if (areaPago) areaPago.style.display = 'none';
    if (seccionDescarga) seccionDescarga.style.display = 'block';
}

// Actualiza la fecha para el pie de página del PDF
function actualizarFechaReporte() {
    const hoy = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const panel = document.querySelector('.results-panel');
    if (panel) {
        panel.setAttribute('data-fecha', hoy.toLocaleDateString('es-ES', opciones));
    }
}

// Render de PayPal
if (window.paypal) {
    paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [{ amount: { value: '10.00' } }]
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(() => {
                desbloquearSistema();
            });
        }
    }).render('#paypal-button-container');
}
// --- Busca esta parte al final de dibujarTabla ---
document.getElementById('montoFinal').innerText = (subtotal + iva).toFixed(2);

// --- AGREGA ESTO AQUÍ ABAJO ---
const panelResultados = document.getElementById('panel-resultados');
// Verificamos si ya existe el contenedor de firma para no repetirlo
if (!document.querySelector('.firma-contenedor')) {
    const firmaHTML = `
        <div class="firma-contenedor">
            <img src="sello-nerbelis.png" class="sello-img" alt="Sello Profesional">
            <div class="linea-firma">
                Ing. Nerbelis Valdeblanques<br>
                CIV: 310409
            </div>
            <p style="font-size: 8pt; margin-top: 10px;">
                Validez Técnica: 7 días continuos desde la fecha de emisión.
            </p>
        </div>
    `;
    panelResultados.insertAdjacentHTML('beforeend', firmaHTML);
}