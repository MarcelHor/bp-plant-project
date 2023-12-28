import {Request, Response} from 'express';
import prisma from "../utils/db";

export const setEmailSettings = async (req: Request, res: Response) => {
    const {subject, recipient} = req.body;

    if (!subject || !recipient) {
        return res.status(400).json({message: 'Missing subject or recipient'});
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
                    recipient
                }
            });
        } else {
            await prisma.emailSettings.create({
                data: {
                    subject,
                    recipient
                }
            });
        }

        return res.status(200).json({message: 'Email settings updated'});
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}