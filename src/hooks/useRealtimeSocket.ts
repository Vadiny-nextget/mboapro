import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';

type RealtimeHandler = (type: string, payload: any) => void;

/** Une seule instance active à la fois (montée dans DashboardLayout) — voir note d'architecture. */
export function useRealtimeSocket(onEvent: RealtimeHandler) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  useEffect(() => {
    if (!accessToken) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL ?? 'ws://localhost:8090'}?token=${accessToken}`;
    let socket: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let isUnmounted = false;

    const connect = () => {
      socket = new WebSocket(wsUrl);
      socket.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data);
          handlerRef.current(type, payload);
        } catch {
          /* trame malformée, ignorée */
        }
      };
      socket.onclose = () => {
        // Reconnexion simple à intervalle fixe — suffisant pour un MVP.
        // Limitation connue : si le JWT expire pendant la session, la reconnexion
        // échouera silencieusement tant que le token en mémoire n'est pas rafraîchi.
        if (!isUnmounted) reconnectTimer = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [accessToken]);
}