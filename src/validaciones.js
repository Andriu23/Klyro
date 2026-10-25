export function validateTaskForm () {
    const nombre = document.getElementById('nombre-tarea').value.trim();
    const descripcion = document.getElementById('descripcion-tarea').value.trim();
    const tipo = document.getElementById('tipo').value;
    const responsable = document.getElementById('responsable').value.trim();
    const prioridad = document.getElementById('prioridad').value;
    const estado = document.getElementById('estado').value;

    const fechaInicio  = document.getElementById('fechaDeInicio').value;
    const fechaEntrega  = document.getElementById('fechaDeEntrega').value;

    if (nombre === "" || nombre.length <= 8) {
        alert("El nombre no puede estar vacío y debe tener más de 8 caracteres.");
        document.getElementById("nombre-tarea").focus();
        return false;
    }

    if (descripcion === "" || descripcion.length <= 15) {
        alert("La descripción no puede estar vacía y debe tener más de 15 caracteres.");
        document.getElementById("descripcion-tarea").focus();
        return false;
    }

    if (tipo === "") {
        alert("Selecciona un tipo de tarea.");
        document.getElementById("tipo").focus();
        return false;
    }

    if (responsable === "" || responsable.length <= 8) {
        alert("El nombre de la persona asignada, no puede estar vacío y debe tener más de 8 caracteres.");
        document.getElementById("responsable").focus();
        return false;
    }

    if (prioridad === "") {
        alert("Selecciona la prioridad de la tarea.");
        document.getElementById("prioridad").focus();
        return false;
    }

    if (estado === "") {
        alert("Selecciona el estado de la tarea.");
        document.getElementById("estado").focus();
        return false;
    }

    if (fechaInicio === "") {
        alert("La Fecha de Inicio no puede estar en blanco.");
        document.getElementById("fechaDeInicio").focus();
        return false;
    }

    if (fechaEntrega === "") {
        alert("La Fecha de Entrega no puede estar en blanco.");
        return false;
    }

    return true;
}