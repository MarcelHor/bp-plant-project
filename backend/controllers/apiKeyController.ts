import prisma from '../utils/db';
import {randomUUID} from "crypto";

export const getApiKeys = async (req, res) => {
    try {
        const apiKeys = await prisma.apiKey.findMany();
        if (!apiKeys) {
            return res.status(404).send('API klíče nebyly nalezeny.');
        }
        const withoutKey = apiKeys.map(apiKey => {
            return {
                id: apiKey.id,
                lastUsed: apiKey.lastUsed,
                usageCount: apiKey.usageCount
            }
        });

        res.json(withoutKey);
    } catch (e) {
        console.error(e);
        res.status(500).send('Nastala chyba při získávání API klíčů.');
    }
}

export const getApiKey = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send('Je vyžadováno ID klíče.');
        }

        const apiKey = await prisma.apiKey.findUnique({
            where: {
                id: id
            }
        });

        if (!apiKey) {
            return res.status(404).send('API klíč nebyl nalezen.');
        }

        res.json(apiKey);
    } catch (e) {
        console.error(e);
        res.status(500).send('Nastala chyba při získávání API klíče.');
    }
}

export const createApiKey = async (req, res) => {
    try {
        const key = randomUUID();
        await prisma.apiKey.create({
            data: {
                key: key
            }
        });


        const apiKey = await prisma.apiKey.findUnique({
            where: {
                key: key
            }
        });

        if (!apiKey) {
            return res.status(404).send('API klíč nebyl nalezen.');
        }

        const withoutKey = {
            id: apiKey.id,
            lastUsed: apiKey.lastUsed,
            usageCount: apiKey.usageCount
        }

        res.json(withoutKey);
    } catch (e) {
        console.error(e);
        res.status(500).send('Nastala chyba při vytváření API klíče.');
    }
}

export const deleteApiKey = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return res.status(400).send('Je vyžadováno ID klíče.');
        }

        const apiKey = await prisma.apiKey.findUnique({
            where: {
                id: id
            }
        });

        if (!apiKey) {
            return res.status(404).send('API klíč nebyl nalezen.');
        }

        await prisma.apiKey.delete({
            where: {
                id: id
            }
        });

        res.send('API klíč byl smazán.');
    } catch (e) {
        console.error(e);
        res.status(500).send('Nastala chyba při mazání API klíče.');
    }
}