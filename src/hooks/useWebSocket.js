import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_URL || 'http://localhost:8001';

/**
 * Hook personalizado para manejar conexiones WebSocket
 * @param {Object} options - Opciones de configuración
 * @param {string} options.empresaId - ID de la empresa
 * @param {string} options.colaId - ID de la cola (opcional)
 * @param {boolean} options.enabled - Si el socket debe estar conectado (default: true)
 * @returns {Object} - { socket, isConnected, error }
 */
export function useWebSocket({ empresaId, colaId, enabled = true }) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // No conectar si no está habilitado o no hay empresaId
    if (!enabled || !empresaId) {
      return;
    }

    // Crear conexión
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Event listeners de conexión
    socket.on('connect', () => {
      console.log('✅ WebSocket conectado');
      setIsConnected(true);
      setError(null);

      // Unirse a la sala correspondiente
      if (colaId) {
        socket.emit('join_queue', { empresaId, colaId });
      } else {
        socket.emit('join_empresa', { empresaId });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket desconectado:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Error de conexión WebSocket:', err);
      setError(err.message);
      setIsConnected(false);
    });

    socket.on('joined_queue', (data) => {
      console.log('✅ Unido a cola:', data);
    });

    socket.on('joined_empresa', (data) => {
      console.log('✅ Unido a empresa:', data);
    });

    socket.on('error', (err) => {
      console.error('❌ Error WebSocket:', err);
      setError(err.message);
    });

    // Cleanup al desmontar
    return () => {
      if (socket) {
        if (colaId) {
          socket.emit('leave_queue', { empresaId, colaId });
        } else {
          socket.emit('leave_empresa', { empresaId });
        }
        socket.disconnect();
      }
    };
  }, [empresaId, colaId, enabled]);

  return {
    socket: socketRef.current,
    isConnected,
    error,
  };
}

/**
 * Hook específico para escuchar actualizaciones de una cola
 * @param {Object} options - Opciones de configuración
 * @param {string} options.empresaId - ID de la empresa
 * @param {string} options.colaId - ID de la cola
 * @param {Function} options.onQueueUpdate - Callback cuando se actualiza la cola
 * @param {Function} options.onTurnoLlamado - Callback cuando se llama un turno
 * @param {Function} options.onTurnoAgregado - Callback cuando se agrega un turno
 * @param {boolean} options.enabled - Si el socket debe estar conectado
 */
export function useQueueWebSocket({
  empresaId,
  colaId,
  onQueueUpdate,
  onTurnoLlamado,
  onTurnoAgregado,
  enabled = true,
}) {
  const { socket, isConnected, error } = useWebSocket({ empresaId, colaId, enabled });

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listener para actualizaciones de cola
    if (onQueueUpdate) {
      socket.on('queue_updated', (data) => {
        // Solo procesar si es de nuestra cola
        if (data.empresaId === empresaId && data.colaId === colaId) {
          console.log('📡 Queue updated:', data.turnos.length, 'turnos');
          onQueueUpdate(data.turnos);
        }
      });
    }

    // Listener para turno llamado
    if (onTurnoLlamado) {
      socket.on('turno_llamado', (data) => {
        if (data.empresaId === empresaId && data.colaId === colaId) {
          console.log('📡 Turno llamado:', data.turno);
          onTurnoLlamado(data.turno);
        }
      });
    }

    // Listener para turno agregado
    if (onTurnoAgregado) {
      socket.on('turno_agregado', (data) => {
        if (data.empresaId === empresaId && data.colaId === colaId) {
          console.log('📡 Turno agregado:', data.turno);
          onTurnoAgregado(data.turno);
        }
      });
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.off('queue_updated');
        socket.off('turno_llamado');
        socket.off('turno_agregado');
      }
    };
  }, [socket, isConnected, empresaId, colaId, onQueueUpdate, onTurnoLlamado, onTurnoAgregado]);

  return { socket, isConnected, error };
}

/**
 * Hook para escuchar actualizaciones de todas las colas de una empresa
 * @param {Object} options - Opciones de configuración
 * @param {string} options.empresaId - ID de la empresa
 * @param {Function} options.onQueueUpdate - Callback cuando se actualiza una cola
 * @param {Function} options.onTurnoLlamado - Callback cuando se llama un turno
 * @param {Function} options.onColaEliminada - Callback cuando se elimina una cola
 * @param {boolean} options.enabled - Si el socket debe estar conectado
 */
export function useEmpresaWebSocket({
  empresaId,
  onQueueUpdate,
  onTurnoLlamado,
  onColaEliminada,
  enabled = true,
}) {
  const { socket, isConnected, error } = useWebSocket({ empresaId, enabled });

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listener para actualizaciones de cola
    if (onQueueUpdate) {
      socket.on('queue_updated', (data) => {
        if (data.empresaId === empresaId) {
          console.log('📡 Queue updated (empresa):', data.colaId);
          onQueueUpdate(data);
        }
      });
    }

    // Listener para turno llamado
    if (onTurnoLlamado) {
      socket.on('turno_llamado', (data) => {
        if (data.empresaId === empresaId) {
          console.log('📡 Turno llamado (empresa):', data.colaId, data.turno);
          onTurnoLlamado(data);
        }
      });
    }

    // Listener para cola eliminada
    if (onColaEliminada) {
      socket.on('cola_eliminada', (data) => {
        if (data.empresaId === empresaId) {
          console.log('📡 Cola eliminada:', data.colaId);
          onColaEliminada(data);
        }
      });
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.off('queue_updated');
        socket.off('turno_llamado');
        socket.off('cola_eliminada');
      }
    };
  }, [socket, isConnected, empresaId, onQueueUpdate, onTurnoLlamado, onColaEliminada]);

  return { socket, isConnected, error };
}
