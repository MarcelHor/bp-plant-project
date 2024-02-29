import {spawn} from 'child_process';
import {Router} from 'express';

const plantAi = Router();

plantAi.get('/predict', (req, res) => {
    const pythonProcess = spawn('python', ['./main.py']);

    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });


    pythonProcess.on('close', (code) => {
        res.send(dataString);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Child stderr:\n${data}`);
        // res.send(JSON.stringify({error: "An error occurred"}));
    });
});

export default plantAi;