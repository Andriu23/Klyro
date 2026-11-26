import { obtenerTareas,  crearTarea,  actualizarTarea, eliminarTarea } from "./api.js";

export class TaskManager {
    constructor() {
        this.tareas = [];
        this.contadorId = 1;
    }

    // Consultar las tareas del backend.
    async cargar() {
        this.tareas = await obtenerTareas();
        return this.tareas;
    }

    getAllTasks() {
        return this.tareas;
    }

    getTasksWithStatus(estado) {
        return this.tareas.filter(tarea => tarea.estado === estado);
    }

    async addTask(tarea) {
        const tareaGuardada = await crearTarea(tarea);
        this.tareas.push(tareaGuardada);
        return tareaGuardada;
    }

    async deleteTask(id) {
        await eliminarTarea(id);
        this.tareas = this.tareas.filter(
            tarea => Number(tarea.id) !== Number(id)
        );
        return true;
    }

    async updateTask(id, nuevoEstado) {
        const tareaExistente = this.tareas.find(
            tarea => Number(tarea.id) === Number(id)
        );

        if (!tareaExistente) {
            throw new Error(
                "No se encontró la tarea que deseas actualizar."
            );
        }

        const tareaActualizada = {
            nombre: tareaExistente.nombre,
            descripcion: tareaExistente.descripcion,
            tipo: tareaExistente.tipo,
            asignadoA: tareaExistente.asignadoA,
            prioridad: tareaExistente.prioridad,
            estado: tareaExistente.estado,
            fechaCreacion: tareaExistente.fechaCreacion,
            fechaInicio: tareaExistente.fechaInicio,
            fechaEntrega: tareaExistente.fechaEntrega,
            ...nuevoEstado
        };

        const respuesta = await actualizarTarea(
            id,
            tareaActualizada
        );

        const indice = this.tareas.findIndex(
            tarea => Number(tarea.id) === Number(id)
        );

        this.tareas[indice] = respuesta;

        return respuesta;
    }
}