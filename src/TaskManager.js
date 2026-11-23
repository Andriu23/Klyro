export class TaskManager {
    constructor() {
        this.tareas = [];
        this.contadorId = 1;
    }

    // Guardar tareas en LocalStorage.

    guardar() {
        localStorage.setItem("klyro_tareas", JSON.stringify(this.tareas));
        localStorage.setItem("klyro_contadorId", String(this.contadorId));
    }

    cargar() {
        const tareasGuardadas = localStorage.getItem("klyro_tareas");
        const contadorGuardado = localStorage.getItem("klyro_contadorId");

        if (tareasGuardadas !== null) {
            this.tareas = JSON.parse(tareasGuardadas);
        }

        if (contadorGuardado !== null) {
            this.contadorId = Number(contadorGuardado);
        }
    }

    getAllTasks() { // Este método permite obtener todas las tareas almacenadas en el arreglo.
        return this.tareas;
    }

    getTasksWithStatus(estado) {
        return this.tareas.filter(tarea => tarea.estado === estado);
    }

    addTask(tarea) {
        tarea.id = this.contadorId;
        this.tareas.push(tarea);
        this.contadorId++;

        return tarea;
    }

    deleteTask(id) {
        const cantidadAnterior = this.tareas.length;
        this.tareas = this.tareas.filter(tarea => tarea.id !== Number(id));
        return this.tareas.length < cantidadAnterior;
    }

    updateTask(id, nuevoEstado) {
        const tarea = this.tareas.find(tarea => tarea.id === Number(id));
        if (tarea) {
            tarea.estado = nuevoEstado;
            return true;
        }
        return false;
    }

    assignTask(id, nuevoResponsable) {
        const tarea = this.tareas.find(tarea => tarea.id === Number(id));
        if (tarea) {
            tarea.asignadoA = nuevoResponsable;
            return true;
        }
        return false;
    }

    updateField(id, campo, valor) {
        const tarea = this.tareas.find(tarea => tarea.id === Number(id));
        if (tarea) {
            tarea[campo] = valor;
            return true;
        }
        return false;
    }
}