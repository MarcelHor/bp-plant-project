import 'express-session';
import prisma from "../utils/db";
import bcrypt from 'bcrypt';

declare module 'express-session' {
    interface SessionData {
        user: { username: string };
    }
}


const login = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        res.status(400).send('Invalid request');
        return;
    }

    const user = await prisma.user.findFirst({
        where: {
            username
        }
    });

    if (!user) {
        res.status(401).send('Invalid credentials');
        return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
        req.session.user = {username};
        res.send('Logged in');
    } else {
        res.status(401).send('Invalid credentials');
    }

}

const logout = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Not logged in');
    }

    req.session.destroy(() => {
        res.send('Logged out');
    });
};

const user = (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Not logged in');
    }
    res.send(req.session.user);
};

const changeCreds = async (req, res) => {
    const {newUsername, newPassword} = req.body;

    if (!newUsername && !newPassword) {
        return res.status(400).send('Invalid request');
    }

    if (!req.session.user) {
        return res.status(401).send('Not logged in');
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: req.session.user.username,
            },
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const updateData: { username?: string; password?: string } = {};

        if (newUsername) {
            updateData.username = newUsername;
        }
        if (newPassword) {
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        await prisma.user.update({
            where: {username: user.username},
            data: updateData,
        });

        if (newUsername) {
            req.session.user.username = newUsername;
        }

        res.send({message: 'User updated'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

export {login, logout, user, changeCreds};