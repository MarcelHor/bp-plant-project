import {Request, Response} from 'express';
import prisma from "../utils/db";
import {runCron} from "../utils/cronjobs/notifications";

export const getEmailSettings = async (req: Request, res: Response) => {
    try {
        const emailSettings = await prisma.emailSettings.findFirst();
        if (!emailSettings) {
            return res.status(404).json({message: 'Email settings not found'});
        }

        return res.status(200).json(emailSettings);
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

export const setEmailSettings = async (req: Request, res: Response) => {
    const {subject, recipient, cronTime} = req.body;

    if (!subject || !recipient || !cronTime) {
        return res.status(400).json({message: 'Missing subject, recipient or cronTime'});
    }

    //cron time must be in format 00:00
    const regex = new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');
    if (!regex.test(cronTime)) {
        return res.status(400).json({message: 'Cron time must be in format 00:00'});
    }

    try {
        const emailSettings = await prisma.emailSettings.findFirst();
        if (emailSettings) {
            await prisma.emailSettings.update({
                where: {
                    id: emailSettings.id
                },
                data: {
                    subject,
                    recipient,
                    cronTime
                }
            });
        } else {
            await prisma.emailSettings.create({
                data: {
                    subject,
                    recipient,
                    cronTime
                }
            });
        }

        await runCron();
        return res.status(200).json({message: 'Email settings updated'});
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}