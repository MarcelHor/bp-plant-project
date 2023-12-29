import {ReactNode, createContext, useContext, useEffect, useState} from 'react';
import {io, Socket} from "socket.io-client";

const WebSocketContext = createContext<Socket | null>(null);

export const WebSocketProvider = ({children}: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        return () => {
            newSocket.close();
        }
    }, []);


    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
