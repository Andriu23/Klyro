const API_URL = 'http://localhost:8080/api/tasks';

// Consultar todas las tareas.
export function obtenerTareas() {
    return fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

// Crear una tarea.
export function crearTarea(tarea) {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarea)
    })
    .then(async response => {
        if (!response.ok) {
            const error = await response.text();
            console.error("Respuesta del backend:", error);
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return response.json();
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
}

// Actualizar una tarea.
export function actualizarTarea(id, tarea) {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarea)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

// Eliminar una tarea.
export function eliminarTarea(id) {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return null;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}