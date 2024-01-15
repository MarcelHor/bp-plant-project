import { Response } from 'express';

type EventClient = {
    id: number;
    res: Response;
};

let clients: EventClient[] = [];

export const addClient = (res: Response) => {
    const clientId = Date.now();
    const newClient: EventClient = { id: clientId, res };
    clients.push(newClient);
    console.log(`Added new client ${clientId}`);

    res.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
        console.log(`Removed client ${clientId}`);
    });
};

export const sendEventMessage = (data: any) => {
    clients.forEach(client =>
        client.res.write(`data: ${JSON.stringify(data)}\n\n`)
    );
};