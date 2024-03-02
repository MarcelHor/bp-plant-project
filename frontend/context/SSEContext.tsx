import {ReactNode, createContext, useContext, useEffect, useState} from 'react';
import axiosInstance from "../api/axiosInstance";
import {useAuth} from "./AuthProvider.tsx";

const SSEContext = createContext<any>(null);

export const SSEProvider = ({children}: { children: ReactNode }) => {
    const [data, setData] = useState(null);
    const {currentUser} = useAuth();

    useEffect(() => {
        if (!currentUser) {
            console.log('No user, not connecting to SSE');
            return;
        }

        const eventSource = new EventSource(axiosInstance.defaults.baseURL + '/events', { withCredentials: true });

        eventSource.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);

            if (parsedData.message === 'heartbeat') {
                console.log('Received heartbeat');
                return;
            }

            console.log('EventSource message:', parsedData);
            setData(parsedData);
        };


        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [currentUser]);

    return (
        <SSEContext.Provider value={data}>
            {children}
        </SSEContext.Provider>
    );
};

export const useSSE = () => useContext(SSEContext);