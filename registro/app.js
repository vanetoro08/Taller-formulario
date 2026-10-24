
const form = document.querySelector('#registro');

// Traduce el estado de validez (input.validity) a un mensaje en español
// que diga CÓMO corregir, no solo "inválido".
function mensajePara(input) {
  const v = input.validity;

  if (v.valueMissing) {
    if (input.type === 'checkbox') return 'Debes aceptar los términos para continuar.';
    if (input.tagName === 'SELECT') return 'Elige un país.';
    return 'Este campo es obligatorio.';
  }
  if (v.badInput) return 'Escribe solo números.';            // ej.: "e" en un campo number
  if (v.typeMismatch) return 'Escribe un correo válido, por ejemplo ana@mail.com.';
  if (v.tooShort) return `Usa al menos ${input.minLength} caracteres.`;
  if (v.tooLong) return `Usa como máximo ${input.maxLength} caracteres.`;
  if (v.rangeUnderflow) return `El valor mínimo es ${input.min}.`;
  if (v.rangeOverflow) return `El valor máximo es ${input.max}.`;
  if (v.patternMismatch) return 'La contraseña debe tener al menos una letra y un número.';
  if (v.stepMismatch) return 'Escribe un número entero, sin decimales.';
  if (v.customError) return input.validationMessage; // el texto de setCustomValidity
  return '';
}

function validarCampo(input) {
  const error = document.getElementById(`${input.id}-error`);
  if (error) error.textContent = mensajePara(input);
}

// Regla entre dos campos: los atributos HTML no la cubren, por eso setCustomValidity
function validarConfirmacion() {
  const pass = form.elements.password;
  const conf = form.elements.confirmar;
  conf.setCustomValidity(
    conf.value && conf.value !== pass.value ? 'Las contraseñas no coinciden.' : ''
  ); // '' (vacío) quita el error; si no se limpia, el campo queda inválido para siempre
}

// Validar al salir del campo (focusout), no a cada tecla.
// focusout "burbujea" hasta el form, así un solo listener sirve para todos los campos.
form.addEventListener('focusout', (e) => {
  if (e.target.name === 'password' || e.target.name === 'confirmar') {
    validarConfirmacion();
    // Si cambió la contraseña, también hay que refrescar el mensaje de la confirmación
    if (form.elements.confirmar.value) validarCampo(form.elements.confirmar);
  }
  if (e.target.willValidate) validarCampo(e.target);
});
