import {prismaMock} from "../utils/prismaMock";
import {addClient,heartbeat,sendEventMessage, clients} from "../controllers/eventController";

describe('addClient', () => {
    it('should add a client and set up removal on close', () => {
        const mockRes = {
            on: jest.fn(),
            write: jest.fn(),
        };
        const initialClientCount = clients.length;

        addClient(mockRes as any);

        expect(clients.length).toBe(initialClientCount + 1);

        const closeHandler = mockRes.on.mock.calls.find(call => call[0] === 'close')[1];
        closeHandler();

        expect(clients.length).toBe(initialClientCount);
    });
});

describe('sendEventMessage', () => {
    it('should send a message to all clients', () => {
        const data = { message: 'hello' };

        sendEventMessage(data);

        clients.forEach(client => {
            expect(client.res.write).toHaveBeenCalledWith(`data: ${JSON.stringify(data)}\n\n`);
        });
    });
});


jest.useFakeTimers();

describe('heartbeat', () => {
    it('should send heartbeat messages', () => {
        heartbeat();

        jest.advanceTimersByTime(10000);

        clients.forEach(client => {
            expect(client.res.write).toHaveBeenCalledWith(`data: ${JSON.stringify({type: 'heartbeat'})}\n\n`);
        });
    });
});
