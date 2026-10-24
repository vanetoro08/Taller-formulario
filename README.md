# Taller: Formularios con validaciones

## Nivel 1 · HTML puro con validación nativa
### ¿Qué pasa si borras el atributo `name` de un campo y envías? ¿Por qué?

El formulario se envía igual, pero ese campo no aparece en los datos de la petición (se puede ver en DevTools › Red). El navegador solo incluye en el envío los controles que tienen `name`, porque ese nombre es la clave del par `clave=valor`. Sin nombre no hay con qué identificar el dato.

El `id` no sirve para esto: el `id` es para el HTML (enlazar el `<label for>` o buscar el elemento desde JavaScript), mientras que el `name` es para los datos que se envían. Por eso `FormData`, que se usa en el nivel 3, tampoco lee campos sin `name`.

---

## Nivel 2 · Estilos de error y mensajes propios

### Cambia `:user-invalid` por `:invalid`. ¿Qué diferencia hay? ¿Cuál es mejor para el usuario?

Con `:invalid`, apenas carga la página todos los campos obligatorios aparecen en rojo, porque están vacíos y técnicamente ya son inválidos. La persona ve errores antes de haber escrito nada.

Con `:user-invalid`, el borde rojo solo aparece después de que la persona interactúa con el campo (lo edita y sale de él) o intenta enviar el formulario.

Es mejor `:user-invalid`: no regaña a nadie por algo que todavía no ha tenido la oportunidad de hacer, y el rojo aparece justo cuando hay algo que corregir.

## Nivel 3 · Envío con fetch + FormData

### ¿Por qué se escucha submit en el formulario y no click en el botón?

Porque un formulario se puede enviar de varias formas, no solo haciendo clic en el botón: por ejemplo, presionando *Enter* dentro de cualquier campo. El evento submit se dispara siempre que el formulario se envía, sin importar cómo. Si escucháramos solo el click del botón, al enviar con Enter nos saltaríamos la validación y el fetch, y la página se recargaría.

### Prueba con la URL rota

Con https://jsonplaceholder.typicode.com/no-existe el servidor responde 404. fetch no falla por eso (solo falla si no hay red), pero como res.ok es false lanzamos el error a mano y el usuario ve: «No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.» Los datos siguen escritos en el formulario y el botón se vuelve a activar.

## Nivel 4 · Validación avanzada en JavaScript puro

### ¿Qué ventaja tiene que las reglas sean funciones puras?

Una función pura solo depende de lo que recibe y solo devuelve un resultado: no lee ni modifica el DOM. Por eso:

- se puede *reutilizar* en otro formulario, o incluso en el servidor con Node, sin cambiar nada;
- se puede *probar* fácilmente, llamándola con un valor y revisando el mensaje que devuelve, sin abrir el navegador;
- las reglas quedan *en un solo lugar*: si cambia una regla, se cambia en validaciones.js y no hay que buscarla por todo el código.

### ¿Por qué «el correo ya existe» no se puede validar solo con atributos HTML?

Porque los atributos HTML solo pueden revisar el valor que está escrito en el campo (si está vacío, su formato, su longitud…). Saber si un correo ya está registrado depende de información que solo tiene el servidor, así que hay que preguntarle, y esa respuesta llega después (es asíncrona). Eso solo se puede hacer con JavaScript.
