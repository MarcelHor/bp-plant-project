import cron from 'node-cron';
import nodemailer from 'nodemailer';
import prisma from "../db";

export const runCron = () => {
    cron.schedule('* * * * *', async () => {
        await sendMail();
    });
}

const Transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});


const sendMail = async () => {
    try {
        const emailSettings = await prisma.emailSettings.findFirst();
        const emailText = await prisma.sensorData.findFirst({
            orderBy: {
                createdAt: 'desc'
            }
        });
        const options = {
            from: 'marcel.stinbank@gmail.com',
            to: emailSettings?.recipient,
            subject: emailSettings?.subject,
            text: `Your daily plant report.\n\n last report: ${emailText?.createdAt}\n humidity: ${emailText?.humidity.toFixed(2)}\n temperature: ${emailText?.temperature.toFixed(2)}\n soil moisture: ${emailText?.soilMoisture.toFixed(2)}\n light: ${emailText?.light.toFixed(2)}`
        };

        if (!emailSettings || !emailText) {
            console.log('Could not send email!');
            return;
        }

        Transport.sendMail(options, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
    } catch (error: any) {
        console.log(error);
    }
}


