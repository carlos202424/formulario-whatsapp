// Función principal que renderiza el HTML
function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("Luxury Prime Agency - Formulario de Registro")
    .setFaviconUrl("https://www.google.com/favicon.ico")
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

// Incluir archivos externos (CSS, JS, etc)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Función para procesar el formulario desde el cliente
function procesarFormulario(formData) {
  try {
    // Obtener la hoja de cálculo activa o crear una nueva
    const ss =
      SpreadsheetApp.getActiveSpreadsheet() ||
      SpreadsheetApp.create("Registros Luxury Prime Agency");
    let sheet = ss.getSheetByName("Registros");

    // Si la hoja no existe, crearla y añadir encabezados
    if (!sheet) {
      sheet = ss.insertSheet("Registros");
      sheet.appendRow([
        "Fecha de Registro",
        "Nombre y Apellido",
        "Fecha de Nacimiento",
        "Correo Electrónico",
        "ID Solicitud",
        "IP",
      ]);
    }

    // Formatear la fecha actual
    const fechaActual = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm:ss"
    );

    // Añadir la nueva fila con los datos del formulario
    sheet.appendRow([
      fechaActual,
      formData.name,
      formData.birthDate,
      formData.email,
      formData.requestId,
      formData.ip,
    ]);

    // Enviar correo de confirmación (opcional)
    enviarCorreoConfirmacion(formData);

    // Devolver éxito
    return {
      success: true,
      message: "Tu solicitud ha sido registrada correctamente.",
    };
  } catch (error) {
    console.error("Error al procesar formulario:", error);
    return {
      success: false,
      message:
        "Hubo un error al procesar tu solicitud. Por favor intenta nuevamente.",
    };
  }
}

// Función para enviar correo de confirmación
function enviarCorreoConfirmacion(formData) {
  try {
    const emailTo = formData.email;
    const subject = "Confirmación de registro - Luxury Prime Agency";

    const body = `
      <h2>¡Gracias por registrarte, ${formData.name}!</h2>
      <p>Hemos recibido tu solicitud de información para Luxury Prime Agency.</p>
      <p>Datos registrados:</p>
      <ul>
        <li><strong>Nombre:</strong> ${formData.name}</li>
        <li><strong>Fecha de nacimiento:</strong> ${formData.birthDate}</li>
        <li><strong>Correo electrónico:</strong> ${formData.email}</li>
        <li><strong>ID de solicitud:</strong> ${formData.requestId}</li>
      </ul>
      <p>Nos pondremos en contacto contigo a la brevedad posible.</p>
      <p>Saludos cordiales,<br>
      <strong>Luxury Prime Agency</strong></p>
    `;

    MailApp.sendEmail({
      to: emailTo,
      subject: subject,
      htmlBody: body,
    });

    return true;
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return false;
  }
}

// Obtener número de teléfono (para ser llamado desde el front)
function getPhoneNumber() {
  return "573107687280"; // O recuperar de alguna configuración/base de datos
}
