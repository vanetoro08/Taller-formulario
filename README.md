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


