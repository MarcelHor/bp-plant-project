import {changeCreds, login, logout, user} from "../controllers/authController";
import {prismaMock} from "../utils/prismaMock";
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('login', () => {
    it('should authenticate a user with valid credentials', async () => {
        const mockUser = {id: 1, username: 'testUser', password: 'hashedPassword'};
        (prismaMock.user as any).findFirst.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);

        const req = {
            body: {username: 'testUser', password: 'testPassword'},
            session: {},
        };
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        await login(req, res);

        expect(res.send).toHaveBeenCalledWith('Logged in');
    });
    it('should return 401 if user is not found', async () => {
        (prismaMock.user as any).findFirst.mockResolvedValue(null);

        const req = {
            body: {username: 'testUser', password: 'testPassword'},
            session: {},
        };
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Invalid credentials');
    });
    it('should return 401 if password is incorrect', async () => {
        const mockUser = {id: 1, username: 'testUser', password: 'hashedPassword'};
        (prismaMock.user as any).findFirst.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        const req = {
            body: {username: 'testUser', password: 'testPassword'},
            session: {},
        };
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Invalid credentials');
    });
});

describe('logout', () => {
    it('should log out a logged in user', async () => {
        const req = {
            session: {
                user: {username: 'testUser'},
                destroy: jest.fn().mockImplementation((callback) => callback()),
            },
        };
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };

        await logout(req, res);

        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith('Logged out');
    });

    it('should return 401 if user is not logged in', async () => {
        const req = {session: {}};
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };

        await logout(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Not logged in');
    });
});

describe('user', () => {
    it('should return user info if user is logged in', async () => {
        const req = {
            session: {
                user: {username: 'testUser'},
            },
        };
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };

        user(req, res);

        expect(res.send).toHaveBeenCalledWith({username: 'testUser'});
    });

    it('should return 401 if user is not logged in', async () => {
        const req = {session: {}};
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };

        user(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Not logged in');
    });
});

describe('changeCreds', () => {
    it('should update user credentials', async () => {
        const mockUser = {id: 1, username: 'testUser', password: 'hashedPassword'};
        (prismaMock.user as any).findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        bcrypt.hash.mockResolvedValue('hashedPassword');
        (prismaMock.user as any).update.mockResolvedValue(mockUser);

        const req = {
            body: {newUsername: 'newTestUser', newPassword: 'newTestPassword'},
            session: {
                user: {username: 'testUser'},
            },
        };
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };

        await changeCreds(req, res);

        expect(res.send).toHaveBeenCalledWith({message: 'User updated'});
    });

    it('should return 401 if user is not logged in', async () => {
        const req = {
            body: {newUsername: 'newTestUser', newPassword: 'newTestPassword'},
            session: {},
        };
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };

        await changeCreds(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Not logged in');
    });

    it('should return 400 if request is invalid', async () => {
        const req = {
            body: {},
            session: {
                user: {username: 'testUser'},
            },
        };
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };

        await changeCreds(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Invalid request');
    });
    //
    // it('should handle errors gracefully', async () => {
    //     (prismaMock.user as any).findUnique.mockRejectedValue(new Error('Database error'));
    //
    //     const req = {
    //         body: {
    //             newUsername: 'newTestUser', newPassword:
    //                 'newTestPassword'
    //         },
    //         session: {
    //             user: {username: 'testUser'},
    //         },
    //     };
    //
    //     const res = {
    //         send: jest.fn().mockReturnThis(),
    //         status: jest.fn().mockReturnThis(),
    //     };
    //
    //     await changeCreds(req, res);
    //
    //     expect(res.status).toHaveBeenCalledWith(500);
    //     expect(res.send).toHaveBeenCalledWith('Internal server error');
    // });

    it('should return 404 if user is not found', async () => {
        (prismaMock.user as any).findUnique.mockResolvedValue(null);

        const req = {
            body: {newUsername: 'newTestUser', newPassword: 'newTestPassword'},
            session: {
                user: {username: 'testUser'},
            },
        };
        const res = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
        };

        await changeCreds(req, res);

        expect(res.status).toHaveBeenCalledWith(404);


        expect(res.send).toHaveBeenCalledWith('User not found');
    });
});