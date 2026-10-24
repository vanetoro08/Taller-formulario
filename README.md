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

## Nivel 5 · Seguridad y usabilidad

### Parte A · La validación del frontend no es seguridad

1. En la versión nativa borramos `min` y `max` del campo Edad con DevTools y enviamos edad 5. El navegador ya no la rechazó y el dato llegó al servidor: la respuesta lo devolvió con `edad: 5`.
2. Desde la consola enviamos un `fetch` directo con `email: 'no-es-correo'` y `edad: -3`, sin pasar por el formulario, y el servidor también lo aceptó.

**¿Qué demuestra?** Que la validación del navegador solo ayuda al usuario a no equivocarse, pero no protege nada: cualquiera puede modificar el HTML o mandar peticiones sin usar el formulario. Por eso el backend tiene que volver a validar todos los datos con el mismo esquema de reglas, como si nunca hubieran sido validados.

**Consultas parametrizadas:** en vez de armar el SQL pegando el texto del usuario dentro de la consulta, se escribe la consulta con espacios reservados (por ejemplo `SELECT * FROM usuarios WHERE email = ?`) y los datos se envían por separado. Así la base de datos siempre trata lo que escribió el usuario como un dato y nunca como parte del código. Un texto como `' OR '1'='1` se busca literalmente como un correo, en lugar de cambiar la condición de la consulta, y eso evita el SQL injection.

### Parte B · Mostrar datos sin abrir la puerta a XSS

Con `innerHTML`, al registrar el nombre `<b>Ana</b>` el saludo mostró **Ana** en negrita: el navegador interpretó lo que escribió el usuario como HTML. Eso significa que alguien podría meter etiquetas o código que se ejecute en la página (XSS). Con `textContent` se vio literalmente `Hola, <b>Ana</b>`, porque el texto se muestra tal cual y nunca se interpreta.

Revisamos cada `innerHTML` del código. Solo queda uno, el de los teléfonos, y es seguro porque el número `${n}` lo genera nuestro propio código; ahí nunca entra texto escrito por el usuario.

### Parte C · Prueba de usabilidad

| Observación | Campo | Problema | Corrección aplicada |
|---|---|---|---|
| 1 | Correo | Al salir «Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?», el compañero se quedó mirando el mensaje sin saber qué hacer, porque el formulario no tiene ninguna opción para iniciar sesión. Al final decidió cambiar el correo por su cuenta. | Se cambió por «Este correo ya está registrado. Usa otro correo.», que dice directamente qué hacer. |
| 2 | Edad | Con edad 16 salió «El valor mínimo es 18.» y el compañero simplemente puso 18 para que pasara, sin entender que la regla es ser mayor de edad. | Se cambió por «Debes tener al menos 18 años para registrarte.», que explica el motivo de la regla. Para eso `rangoEntero` ahora acepta un mensaje propio para el mínimo. |
| 3 | Términos | Usando solo el teclado, el compañero intentó 3 veces marcar la casilla de términos con Enter y no se marcaba. En un checkbox la tecla para marcar es Espacio; Enter envía el formulario, así que le volvía a salir el error «Debes aceptar los términos para continuar.» | Se agregó un `keydown` en la casilla para que Enter también la marque o desmarque, sin enviar el formulario. Además se agrandó la casilla y se hizo que el foco amarillo se vea aunque tenga error. |
