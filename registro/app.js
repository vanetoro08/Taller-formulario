// app.js
import { reglas, validarCampo, validarFormulario, formatoTelefono } from './validaciones.js';

const form = document.querySelector('#registro');
const boton = form.querySelector('button[type="submit"]');
const mensaje = document.querySelector('#mensaje');

const leerDatos = () => Object.fromEntries(new FormData(form));

function mostrarError(nombre, mensaje) {
  const campo = form.elements[nombre];
  const error = document.getElementById(`${nombre}-error`);
  campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
  if (error) error.textContent = mensaje ?? '';
}

// ===== Parte A: validar al salir del campo usando el módulo =====

form.addEventListener('focusout', (e) => {
  if (!e.target.name) return;
  if (e.target.name === 'telefono') { revisarTelefonos(); return; }
  mostrarError(e.target.name, validarCampo(e.target.name, leerDatos()));
});

// ===== Parte B: validación asíncrona del correo =====

// Simula al servidor: estos correos ya están registrados
const registrados = ['ana@mail.com', 'admin@mail.com'];

const correoDisponible = (email) =>
  new Promise((ok) => setTimeout(() => ok(!registrados.includes(email.toLowerCase())), 600));

function debounce(fn, ms) {
  let espera;
  return (...args) => {
    clearTimeout(espera);
    espera = setTimeout(() => fn(...args), ms);
  };
}

const revisarCorreo = debounce(async (email) => {
  if (validarCampo('email', { email })) return; // primero el formato
  mostrarError('email', 'Comprobando disponibilidad…');
  const libre = await correoDisponible(email);
  mostrarError('email', libre ? null : 'Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?');
}, 500);

form.elements.email.addEventListener('input', (e) => revisarCorreo(e.target.value));

// ===== Parte C: campos dinámicos (varios teléfonos) =====

const lista = document.querySelector('#telefonos');
const errorTelefonos = document.querySelector('#telefonos-error');
const reglaTelefono = formatoTelefono();

document.querySelector('#agregar-telefono').addEventListener('click', () => {
  if (lista.children.length >= 3) return;
  const n = lista.children.length + 1;
  const fila = document.createElement('div');
  fila.innerHTML = `
    <label for="tel-${n}">Teléfono ${n}</label>
    <input id="tel-${n}" name="telefono" type="tel" inputmode="tel" autocomplete="tel">
    <button type="button" class="quitar">Quitar</button>`;
  lista.append(fila);
  fila.querySelector('input').focus();
});

// Delegación de eventos: un solo listener para todos los botones «Quitar»
lista.addEventListener('click', (e) => {
  if (e.target.matches('.quitar')) {
    e.target.parentElement.remove();
    revisarTelefonos(); // para que no quede un error de un teléfono que ya no existe
  }
});

// Varios campos con el mismo name se leen con getAll(), no con get()
function revisarTelefonos() {
  const numeros = new FormData(form).getAll('telefono');
  const inputs = lista.querySelectorAll('input[name="telefono"]');
  let primerError = null;

  numeros.forEach((numero, i) => {
    const error = reglaTelefono(numero);
    inputs[i].setAttribute('aria-invalid', error ? 'true' : 'false');
    if (error && !primerError) primerError = { input: inputs[i], error };
  });

  errorTelefonos.textContent = primerError ? primerError.error : '';
  return primerError;
}

// ===== Envío (nivel 3, ahora con el módulo) =====

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Mostrar todos los errores (y limpiar los que ya se corrigieron)
  const datos = leerDatos();
  const errores = validarFormulario(datos);
  for (const nombre of Object.keys(reglas)) {
    mostrarError(nombre, errores[nombre] ?? null);
  }
  const errorTel = revisarTelefonos();

  // Enfocar el primer campo con error
  const primero = Object.keys(errores)[0];
  if (primero) {
    form.elements[primero].focus();
    return;
  }
  if (errorTel) {
    errorTel.input.focus();
    return;
  }

  boton.disabled = true;
  boton.textContent = 'Enviando…';

  try {
    datos.telefono = new FormData(form).getAll('telefono'); // lista con todos los números
    delete datos.confirmar; // no se envía la confirmación

    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const creado = await res.json();
    mensaje.textContent = `¡Cuenta creada! Id: ${creado.id}`;
    form.reset();
  } catch (err) {
    mensaje.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';
    console.error(err); // para depurar
  } finally {
    boton.disabled = false;
    boton.textContent = 'Crear cuenta';
  }
});
