import { TaskManager } from "./TaskManager.js"; // Importarmos la clase y sus funcionalidades
import { validateTaskForm } from "./validaciones.js"; // Importarmos la clase y sus funcionalidades

const administrador = new TaskManager(); // Crea un objeto a partir de la clase TaskManager

const formulario = document.getElementById("formTarea");
const listaTareas = document.getElementById("listaTareas");
const filtro = document.getElementById("filtro");
const btnEliminarSeleccionadas = document.getElementById("btnEliminarSeleccionadas");

const panelKanban = document.querySelector(".panel-kanban");

const fechaDeCreacion = document.getElementById("fechaDeCreacion");
const fechaDeInicio = document.getElementById("fechaDeInicio");
const fechaDeEntrega = document.getElementById("fechaDeEntrega");

// Referencias a las cuatro columnas del tablero.
const columnas = {
    "POR HACER": document.getElementById("columna-por-hacer"),
    "EN PROCESO": document.getElementById("columna-en-proceso"),
    "REVISION": document.getElementById("columna-revision"),
    "HECHO": document.getElementById("columna-hecho")
};

// Referencias a los contadores.
const contadores = {
    "POR HACER": document.getElementById("contador-por-hacer"),
    "EN PROCESO": document.getElementById("contador-en-proceso"),
    "REVISION": document.getElementById("contador-revision"),
    "HECHO": document.getElementById("contador-hecho")
};

// Colocar la fecha de creación y restringir las fechas.
function actualizarFechas() {

    const fecha = new Date();

    fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());

    // Establecer fecha y hora actual.
    fechaDeCreacion.value = fecha.toISOString().slice(0, 16);

    // La fecha de creación permanece bloqueada para edición manual.
    fechaDeCreacion.readOnly = true;

    // Establecer la fecha mínima de inicio.
    const fechaActual = fecha.toISOString().slice(0, 10);

    fechaDeInicio.min = fechaActual;

    // Limpiar las fechas de inicio y entrega.
    fechaDeInicio.value = "";
    fechaDeEntrega.value = "";

    // La fecha de entrega depende de la fecha de inicio.
    fechaDeEntrega.min = fechaActual;
}

// Actualizar la fecha de creación al limpiar el formulario.
formulario.addEventListener("reset", () => {

    setTimeout(() => {
        actualizarFechas();
    }, 0);

});

actualizarFechas();

// Actualizar la fecha mínima de entrega.
fechaDeInicio.addEventListener("change", () => {
    fechaDeEntrega.min = fechaDeInicio.value; // Actualiza la fecha mínima de entrega para que coincida con el inicio seleccionado.

    if (fechaDeEntrega.value < fechaDeInicio.value) { // Si la fecha de entrega es menor a la fecha inicio, la fecha de entrega se limpia.
        fechaDeEntrega.value = "";
    }
});

// Obtener la clase CSS según la prioridad.
function obtenerClasePrioridad(prioridad) {
    if (prioridad === "Alta") return "prioridad-alta";
    if (prioridad === "Media") return "prioridad-media";
    return "prioridad-baja";
}

// Obtener el nombre del estado.
function obtenerNombreEstado(estado) {
    const nombres = {
        "POR HACER": "Por hacer",
        "EN PROCESO": "En proceso",
        "REVISION": "En revisión",
        "HECHO": "Hecho"
    };

    return nombres[estado] || estado;
}

// Crear la tarjeta de una tarea.
function crearTarjeta(tarea) {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta-tarea");
    tarjeta.dataset.id = tarea.id;

    tarjeta.innerHTML = `
    <div class="tarea-card" data-id="${tarea.id}">
        <div class="tarea-header">
            <span class="tarea-id">#${tarea.id}</span>
            <strong class="${obtenerClasePrioridad(tarea.prioridad)}">${tarea.prioridad}</strong>
        </div>
        <h3 class="tarea-titulo">${tarea.nombre}</h3>
        <p class="tarea-descripcion"><strong>Descripción:</strong> ${tarea.descripcion}</p>

        <div class="tarea-meta">
            <p><strong>Tipo:</strong> ${tarea.tipo}</p>
            <p><strong>Responsable:</strong> ${tarea.asignadoA}</p>
            <p><strong>Estado actual:</strong><span class="badge-estado">${obtenerNombreEstado(tarea.estado)}</span></p>
        </div>

        <div class="tarea-fechas">
            <small>📅 <strong>Creación:</strong> ${tarea.fechaDeCreacion.replace("T", " ")}</small>
            <small>🚀 <strong>Inicio:</strong> ${tarea.fechaDeInicio}</small>
            <small>🏁 <strong>Entrega:</strong> ${tarea.fechaDeEntrega}</small>
        </div>

        <div class="tarea-edicion">
            <div class="campo-grupo">
                <label>Estado</label>
                <select class="campo-estado">
                    <option value="POR HACER" ${tarea.estado === "POR HACER" ? "selected" : ""}>Por hacer</option>
                    <option value="EN PROCESO" ${tarea.estado === "EN PROCESO" ? "selected" : ""}>En proceso</option>
                    <option value="REVISION" ${tarea.estado === "REVISION" ? "selected" : ""}>Revisión</option>
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
                    <option value="Desarrollo" ${tarea.tipo === "Desarrollo" ? "selected" : ""}>Desarrollo</option>
                    <option value="Diseño" ${tarea.tipo === "Diseño" ? "selected" : ""}>Diseño</option>
                    <option value="Documentación" ${tarea.tipo === "Documentación" ? "selected" : ""}>Documentación</option>
                    <option value="Pruebas" ${tarea.tipo === "Pruebas" ? "selected" : ""}>Pruebas</option>
                </select>
            </div>
        </div>

        <div class="tarea-footer">
            <label class="checkbox-label"><input type="checkbox" class="seleccionar-tarea" data-id="${tarea.id}">Seleccionar</label>
            
            <div class="tarea-botones">
                ${tarea.estado !== "HECHO" ? '<button type="button" class="btn-completar">Tarea completada</button>' : ""}
                <button type="button" class="btn-eliminar">Eliminar</button>
                <button type="button" class="btn-confirmar-cambios">Actualizar</button>
            </div>
        </div>
    </div>
    `;

    // Actualizar los datos de la tarea.
    tarjeta.querySelector(".btn-confirmar-cambios").addEventListener("click", () => {
        const nuevoEstado = tarjeta.querySelector(".campo-estado").value;
        const nuevoResponsable = tarjeta.querySelector(".campo-responsable").value.trim();
        const nuevaPrioridad = tarjeta.querySelector(".campo-prioridad").value;
        const nuevoTipo = tarjeta.querySelector(".campo-tipo").value;

        // Verificar que el responsable no esté vacío.
        if (nuevoResponsable === "" || nuevoResponsable.length <= 8) {
            alert("El nombre del responsable debe tener más de 8 caracteres.");
            return;
        }

        // Guardar los cambios usando los métodos de TaskManager.
        administrador.updateTask(tarea.id, nuevoEstado);
        administrador.assignTask(tarea.id, nuevoResponsable);
        administrador.updateField(tarea.id, "prioridad", nuevaPrioridad);
        administrador.updateField(tarea.id, "tipo", nuevoTipo);

        administrador.guardar();

        // Mostrar nuevamente las tarjetas actualizadas.
        mostrarTareas();
    });

    // Eliminar una tarea.
    tarjeta.querySelector(".btn-eliminar").addEventListener("click", () => {
        administrador.deleteTask(tarea.id);

        administrador.guardar();

        mostrarTareas();
    });

    return tarjeta;
}


function ajustarAlturaTarjeta(tarjeta, mostrarReverso) {
    const frente = tarjeta.querySelector(".kanban-frente");
    const reverso = tarjeta.querySelector(".kanban-reverso");
    const interior = tarjeta.querySelector(".kanban-tarjeta-interior");

    const caraVisible = mostrarReverso ? reverso : frente;

    interior.style.height = `${caraVisible.offsetHeight}px`;
}

// Crear la tarjeta del tablero con vista frontal y reverso.
function crearTarjetaKanban(tarea) {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("kanban-tarjeta");

    tarjeta.innerHTML = `
        <div class="kanban-tarjeta-interior">

            <div class="kanban-cara kanban-frente">
                <div class="kanban-tarjeta-cabecera">
                    <span class="kanban-id">Tarea #${tarea.id}</span>
                    <span class="etiqueta-prioridad ${obtenerClasePrioridad(tarea.prioridad)}">${tarea.prioridad}</span>
                </div>

                <h4>${tarea.nombre}</h4>
                <p><strong>Tipo:</strong> ${tarea.tipo}</p>
                <p><strong>Asignado a:</strong> ${tarea.asignadoA}</p>
                <p><strong>Entrega:</strong> ${tarea.fechaDeEntrega}</p>

                <button type="button" class="btn-detalles">Ver detalles</button>
            </div>

            <div class="kanban-cara kanban-reverso">
                <div class="kanban-tarjeta-cabecera">
                    <span class="kanban-id">Detalles #${tarea.id}</span>
                    <span class="etiqueta-prioridad ${obtenerClasePrioridad(tarea.prioridad)}">${tarea.prioridad}</span>
                </div>

                <h4>${tarea.nombre}</h4>
                <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
                <p><strong>Estado:</strong> ${obtenerNombreEstado(tarea.estado)}</p>
                <p><strong>Tipo:</strong> ${tarea.tipo}</p>
                <p><strong>Asignado a:</strong> ${tarea.asignadoA}</p>
                <p><strong>Creación:</strong> ${tarea.fechaDeCreacion.replace("T", " ")}</p>
                <p><strong>Inicio:</strong> ${tarea.fechaDeInicio}</p>
                <p><strong>Entrega:</strong> ${tarea.fechaDeEntrega}</p>

                <button type="button" class="btn-volver">Volver</button>
            </div>

        </div>
    `;

    // Establecer la altura inicial del frente después de renderizar.
    requestAnimationFrame(() => {
        ajustarAlturaTarjeta(tarjeta, false);
    });

    // Mostrar el reverso con los detalles.
    tarjeta.querySelector(".btn-detalles").addEventListener("click", () => {
        ajustarAlturaTarjeta(tarjeta, true);
        tarjeta.classList.add("mostrar-reverso");
    });

    // Regresar a la vista frontal.
    tarjeta.querySelector(".btn-volver").addEventListener("click", () => {
        ajustarAlturaTarjeta(tarjeta, false);
        tarjeta.classList.remove("mostrar-reverso");
    });

    return tarjeta;
}

// Mostrar las tareas en el tablero Kanban.
function mostrarTablero() {
    const todasLasTareas = administrador.getAllTasks();

    // Ocultar el tablero si no existen tareas.
    if (todasLasTareas.length === 0) {
        panelKanban.style.display = "none";
        return;
    }

    panelKanban.style.display = "block";

    // Limpiar las columnas.
    Object.values(columnas).forEach(columna => {
        columna.innerHTML = "";
    });

    // Reiniciar los contadores.
    Object.values(contadores).forEach(contador => {
        contador.textContent = "0";
    });

    // Distribuir las tareas según su estado.
    todasLasTareas.forEach(tarea => {
        const columna = columnas[tarea.estado];

        if (columna) {
            columna.appendChild(crearTarjetaKanban(tarea));

            const cantidad = Number(contadores[tarea.estado].textContent);
            contadores[tarea.estado].textContent = cantidad + 1;
        }
    });

    // Mostrar un mensaje cuando una columna esté vacía.
    Object.entries(columnas).forEach(([estado, columna]) => {
        if (columna.children.length === 0) {
            columna.innerHTML = '<p class="kanban-vacio">No hay tareas</p>';
        }
    });
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
        listaTareas.innerHTML = '<p class="mensaje-vacio">No hay tareas para mostrar.</p>';
    } else {
        // Crear y mostrar cada tarjeta.
        tareas.forEach(tarea => {
            listaTareas.appendChild(crearTarjeta(tarea));
        });
    }

    // Actualizar también el tablero Kanban.
    mostrarTablero();
}

// Completar tareas desde el Backlog.
listaTareas.addEventListener("click", (evento) => {

    if (evento.target.classList.contains("btn-completar")) {
        const elementoTarea = evento.target.closest(".tarea-card");
        const id = Number(elementoTarea.dataset.id);

        administrador.updateTask(id, "HECHO");

        administrador.guardar();

        mostrarTareas();

    }
});

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
    administrador.guardar();
    mostrarTareas();

    // Limpiar el formulario y Actualizar fecha Actual
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

    administrador.guardar();

    mostrarTareas();
});

// Recuperar las tareas guardadas.
administrador.cargar();

// Mostrar las tareas al abrir la página.
mostrarTareas();