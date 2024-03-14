import prisma from '../utils/db';

export function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.status(401).send('Autentizace je nutná.');
}

export async function ensureApiKey(req, res, next) {
    try {

        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            return res.status(401).send('Autentizace je nutná. Vyžaduje se API klíč.');
        }

        const savedApiKey = await prisma.apiKey.findUnique({
            where: {
                key: apiKey
            }
        });

        if (!savedApiKey) {
            return res.status(401).send('Nesprávný API klíč.');
        }

        if (savedApiKey) {
            await prisma.apiKey.update({
                where: {
                    key: apiKey
                },
                data: {
                    lastUsed: new Date(),
                    usageCount: {
                        increment: 1
                    }
                }
            });
            return next();
        }

        res.status(401).send('Nesprávný API klíč.');
    } catch (e) {
        console.error(e);
        res.status(500).send('Nastala chyba při ověřování API klíče.');
    }
}
