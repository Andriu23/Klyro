export class TaskManager {
    constructor() {
        this.tareas = [];
        this.contadorId = 1;
    }

    getAllTasks() {
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