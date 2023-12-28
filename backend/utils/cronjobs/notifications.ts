import cron from 'node-cron';
import nodemailer from 'nodemailer';
import prisma from "../db";

let cronJob: cron.ScheduledTask | null = null;

export const runCron = async () => {
    if (cronJob) {
        cronJob.stop();
    }

    const emailSettings = await prisma.emailSettings.findFirst();
    const emailText = await prisma.sensorData.findFirst({
        orderBy: {
            createdAt: 'desc'
        }
    });

    if(!emailSettings || !emailText) {
        console.log('No email settings or no email text');
        return;
    }

    const options = {
        from: 'marcel.stinbank@gmail.com',
        to: emailSettings.recipient,
        subject: emailSettings.subject,
        text: `Your daily plant report.\n\n last report: ${emailText.createdAt}\n humidity: ${emailText.humidity.toFixed(2)}\n temperature: ${emailText.temperature.toFixed(2)}\n soil moisture: ${emailText.soilMoisture.toFixed(2)}\n light: ${emailText.light.toFixed(2)}`
    };

    const cronTime = convertToCronTime(emailSettings.cronTime);

    cronJob = cron.schedule(cronTime, async () => {
        await sendMail(options);
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


const sendMail = async (options: nodemailer.SendMailOptions) => {
    try {
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

const convertToCronTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${minutes} ${hours} * * *`;
}