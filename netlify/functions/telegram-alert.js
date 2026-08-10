const https = require('https');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const bodyData = JSON.parse(event.body || '{}');
        
        // Netlify envía los campos del formulario directamente dentro de la propiedad 'data'
        const formData = bodyData.data || bodyData;

        const TOKEN = "8705847621:AAFwpWtjqL_aodD87jsEQMv3YrmBF3e6gAA";
        const CHAT_ID = "1526051706";

        // Capturamos los campos probando distintas combinaciones de nombres comunes
        const nombre = formData.nombre || formData.name || formData.cliente || "Sin nombre";
        const email = formData.email || formData.correo || "Sin correo";
        const asunto = formData.asunto || formData.subject || formData.nivel || "Nuevo mensaje web";
        const mensajeTexto = formData.mensaje || formData.message || formData.comentario || formData.text || "Sin mensaje";

        const textoTelegram = "📩 ¡NUEVO MENSAJE DESDE LA WEB!\n\n" +
                              "👤 De: " + nombre + "\n" +
                              "📧 Correo: " + email + "\n" +
                              "📌 Asunto: " + asunto + "\n\n" +
                              "💬 Mensaje:\n" + mensajeTexto + "\n\n" +
                              "⚠️ Entra a tu correo o panel para responder.";

        const url = "https://api.telegram.org/bot" + TOKEN + "/sendMessage?chat_id=" + CHAT_ID + "&text=" + encodeURIComponent(textoTelegram);

        await new Promise(function(resolve, reject) {
            https.get(url, function(res) {
                let resData = "";
                res.on("data", function(chunk) { resData += chunk; });
                res.on("end", function() { resolve(resData); });
            }).on("error", function(err) { reject(err); });
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Enviado con éxito" })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};