import { spawn } from 'child_process';
import { Router } from 'express';
import { getImageById } from "../utils/imageUtils";

const plantAi = Router();

plantAi.get('/predict', async (req, res) => {
    const imageID = req.query.imageID as string;
    const useSicknessModel = req.query.useSicknessModel === 'true';

    if (!imageID) {
        return res.status(400).json({error: "No image ID provided"});
    }

    try {
        const image = await getImageById(imageID);
        const imagePath = `./static/images/${image}`;
        const scriptPath = useSicknessModel ? './plantDetection/sicknessDetection.py' : './plantDetection/healthDetection.py';


        //SET TO PYTHON3 FOR LINUX
        const pythonProcess = spawn('python', [scriptPath, imagePath]);
        let dataString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            // console.error(`Child stderr:\n${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({error: "An error occurred during the prediction process"});
            }

            return res.status(200).json({data: JSON.parse(dataString)});
        });
    } catch (error: any) {
        if (error.message.includes('Image not found')) {
            return res.status(404).json({error: "Image not found"});
        }
        console.error(`Error: ${error.message}`);
        return res.status(500).json({error: "An error occurred during the prediction process"});
    }
});

export default plantAi;
