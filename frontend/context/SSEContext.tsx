import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from "../api/axiosInstance";
const SSEContext = createContext<any>(null);

export const SSEProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const eventSource = new EventSource(axiosInstance.defaults.baseURL + '/events');

        eventSource.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
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
    }, []);

    return (
        <SSEContext.Provider value={data}>
            {children}
        </SSEContext.Provider>
    );
};

export const useSSE = () => useContext(SSEContext);