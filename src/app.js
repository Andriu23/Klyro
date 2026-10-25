import { TaskManager } from "./TaskManager.js"; // Importarmos la clase y sus funcionalidades
import { validateTaskForm } from "./validaciones.js"; // Importarmos la clase y sus funcionalidades

const administrador = new TaskManager(); // Crea un objeto a partir de la clase TaskManager

const formulario = document.getElementById("formTarea");
const listaTareas = document.getElementById("listaTareas");
const filtro = document.getElementById("filtro");
const btnEliminarSeleccionadas = document.getElementById("btnEliminarSeleccionadas");

const fechaDeCreacion = document.getElementById("fechaDeCreacion");
const fechaDeInicio = document.getElementById("fechaDeInicio");
const fechaDeEntrega = document.getElementById("fechaDeEntrega");

// Colocar la fecha de creación y restringir las fechas.
function actualizarFechas() {
    const fecha = new Date(); // Se obtiene la fecha actual
    fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());

    fechaDeCreacion.value = fecha.toISOString().slice(0, 16); // Convierte la fecha a formato  (YYYY-MM-DDTHH:mm)
    fechaDeInicio.min = fechaDeCreacion.value.slice(0, 10); // La fecha de inicio toma como minimo la fecha de creación (YYYY-MM-DD)
    fechaDeEntrega.min = fechaDeInicio.value || fechaDeInicio.min; // La fecha de entrega tomo como referencia la fecha inicio 
}

actualizarFechas();

// Actualizar la fecha mínima de entrega.
fechaDeInicio.addEventListener("change", () => {
    fechaDeEntrega.min = fechaDeInicio.value; // Actualiza la fecha mínima de entrega para que coincida con el inicio seleccionado.

    if (fechaDeEntrega.value < fechaDeInicio.value) { // Si la fecha de entrega es menor a la fecha inicio, la fecha de entrega se limpia.
        fechaDeEntrega.value = "";
    }
});

// Crear la tarjeta de una tarea.
function crearTarjeta(tarea) {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta-tarea");

    tarjeta.innerHTML = `
    <div class="tarea-card" data-id="${tarea.id}">
    
        <div class="tarea-header">
            <span class="tarea-id">#${tarea.id}</span>
            <strong>${tarea.prioridad}</strong>
        </div>
        <h3 class="tarea-titulo">${tarea.nombre}</h3>
        <p class="tarea-descripcion"><strong>Descripción:</strong> ${tarea.descripcion}</p>

        <div class="tarea-meta">
            <p><strong>Tipo:</strong> ${tarea.tipo}</p>
            <p><strong>Responsable:</strong> ${tarea.asignadoA}</p>
            <p><strong>Estado actual:</strong> <span class="badge-estado">${tarea.estado}</span></p>
        </div>

        <div class="tarea-fechas">
            <small>📅 <strong>Creación:</strong> ${tarea.fechaDeCreacion.replace("T", " ")}</small>
            <small>🚀 <strong>Inicio:</strong> ${tarea.fechaDeInicio}</small>
            <small>🏁 <strong>Entrega:</strong> ${tarea.fechaDeEntrega}</small>
        </div>

        <hr class="tarea-divider">

        <div class="tarea-edicion">
            <div class="campo-grupo">
                <label>Estado</label>
                <select class="campo-estado">
                    <option value="POR HACER" ${tarea.estado === "POR HACER" ? "selected" : ""}>Por hacer</option>
                    <option value="EN PROCESO" ${tarea.estado === "EN PROCESO" ? "selected" : ""}>En proceso</option>
                    <option value="REVISION" ${tarea.estado === "REVISION" ? "selected" : ""}>Revisión</option>
                    <option value="HECHO" ${tarea.estado === "HECHO" ? "selected" : ""}>Hecho</option>
                </select>
            </div>

            <div class="campo-grupo">
                <label>Responsable</label>
                <input type="text" class="campo-responsable" value="${tarea.asignadoA}">
            </div>

            <div class="campo-grupo">
                <label>Prioridad</label>
                <select class="campo-prioridad">
                    <option value="Alta" ${tarea.prioridad === "Alta" ? "selected" : ""}>Alta</option>
                    <option value="Media" ${tarea.prioridad === "Media" ? "selected" : ""}>Media</option>
                    <option value="Baja" ${tarea.prioridad === "Baja" ? "selected" : ""}>Baja</option>
                </select>
            </div>

            <div class="campo-grupo">
                <label>Tipo de tarea</label>
                <select class="campo-tipo">
                    <<option value="Desarrollo" ${tarea.tipo === "Desarrollo" ? "selected" : ""}>Desarrollo</option>
                    <option value="Diseño" ${tarea.tipo === "Diseño" ? "selected" : ""}>Diseño</option>
                    <option value="Documentación" ${tarea.tipo === "Documentación" ? "selected" : ""}>Documentación</option>
                    <option value="Pruebas" ${tarea.tipo === "Pruebas" ? "selected" : ""}>Pruebas</option>
                </select>
            </div>
        </div>

        <div class="tarea-footer">
            <label class="checkbox-label">

                <input type="checkbox" class="seleccionar-tarea" data-id="${tarea.id}">Seleccionar</label>
            
            <div class="tarea-botones">
                <button type="button" class="btn-eliminar">Eliminar</button>
                <button type="button" class="btn-confirmar-cambios">Actualizar</button>
            </div>
        </div>
    </div>
    `;

 tarjeta.querySelector(".btn-confirmar-cambios").addEventListener("click", () => {
        const nuevoEstado = tarjeta.querySelector(".campo-estado").value;
        const nuevoResponsable = tarjeta.querySelector(".campo-responsable").value.trim();
        const nuevaPrioridad = tarjeta.querySelector(".campo-prioridad").value;
        const nuevoTipo = tarjeta.querySelector(".campo-tipo").value;

        // Verificar que el responsable no esté vacío.
        if (nuevoResponsable === "") {
            alert("Debes escribir el nombre del responsable.");
            return;
        }

        // Guardar los cambios usando los métodos de TaskManager.
        administrador.updateTask(tarea.id, nuevoEstado);
        administrador.assignTask(tarea.id, nuevoResponsable);
        administrador.updateField(tarea.id, "prioridad", nuevaPrioridad);
        administrador.updateField(tarea.id, "tipo", nuevoTipo);

        // Mostrar nuevamente las tarjetas actualizadas.
        mostrarTareas();
    });

    // Eliminar una tarea.
    tarjeta.querySelector(".btn-eliminar").addEventListener("click", () => {
        administrador.deleteTask(tarea.id);
        mostrarTareas();
    });

    return tarjeta;
}

// Mostrar las tareas y aplicar el filtro.
function mostrarTareas() {
    listaTareas.innerHTML = "";

    // Obtener todas las tareas.
    let tareas = administrador.getAllTasks();

    // Filtrar por estado si se seleccionó uno.
    if (filtro.value !== "") {
        tareas = administrador.getTasksWithStatus(filtro.value);
    }

    // Mostrar un mensaje si no hay tareas.
    if (tareas.length === 0) {
        listaTareas.innerHTML = "<p>No hay tareas para mostrar.</p>";
        return;
    }

    // Crear y mostrar cada tarjeta.
    tareas.forEach(tarea => {
        listaTareas.appendChild(crearTarjeta(tarea));
    });
}

// Crear una tarea nueva.
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault(); // Evitar que se recargue la página.

    // Validar los campos del formulario.
    if (!validateTaskForm()) {
        return;
    }

    // Obtener los datos del formulario.
    const tarea = {
        nombre: document.getElementById("nombre-tarea").value.trim(),
        descripcion: document.getElementById("descripcion-tarea").value.trim(),
        tipo: document.getElementById("tipo").value,
        asignadoA: document.getElementById("responsable").value.trim(),
        prioridad: document.getElementById("prioridad").value,
        estado: document.getElementById("estado").value,
        fechaDeCreacion: fechaDeCreacion.value,
        fechaDeInicio: fechaDeInicio.value,
        fechaDeEntrega: fechaDeEntrega.value
    };

    // Guardar la tarea y actualizar la página.
    administrador.addTask(tarea);
    mostrarTareas();

    // Limpiar el formulario y establecer la fecha actual.
    formulario.reset();
    actualizarFechas();
});

// Aplicar el filtro cuando cambie la selección.
filtro.addEventListener("change", mostrarTareas);

// Eliminar las tareas seleccionadas.
btnEliminarSeleccionadas.addEventListener("click", () => {
    const seleccionadas = document.querySelectorAll(
        "#listaTareas .seleccionar-tarea:checked"
    );

    // Verificar que se haya seleccionado alguna tarea.
    if (seleccionadas.length === 0) {
        alert("Selecciona al menos una tarea.");
        return;
    }

    // Eliminar cada tarea seleccionada.
    seleccionadas.forEach(casilla => {
        administrador.deleteTask(Number(casilla.dataset.id));
    });

    mostrarTareas();
});

// Mostrar las tareas al abrir la página.
mostrarTareas();