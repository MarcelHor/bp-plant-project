import {Router} from 'express';

const authRouter = Router();
import 'express-session';

declare module 'express-session' {
    interface SessionData {
        user: { username: string };
    }
}

function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.status(401).send('Autentizace je nutná.');
}

authRouter.post('/login', (req, res) => {
    const {username, password} = req.body;
    console.log(username, password + ' ' + "test");
    if (username === 'admin' && password === 'admin') {
        req.session.user = {username: 'admin'};
        res.send('Přihlášení bylo úspěšné');
    } else {
        res.status(401).send('Neplatné přihlašovací údaje');
    }

});

authRouter.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send('Odhlášení bylo úspěšné');
    });
});

authRouter.get('/user', ensureAuthenticated, (req, res) => {
    res.send(req.session.user);
});

export {authRouter, ensureAuthenticated}