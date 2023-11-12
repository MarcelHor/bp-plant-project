import {useState, useEffect} from 'react';
import axios from 'axios';

interface ImageData {
    imageUri: string;
    id: string;
    soilMoisture: number;
    temperature: number;
    humidity: number;
}


function App() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [mainImageData, setMainImageData] = useState<ImageData>();

    useEffect(() => {
        axios.get('http://localhost:3000/sensor-data/latest').then((response: any) => {
            setMainImageData(response.data);
        });
    }, []);


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <>
            <header className="navbar bg-base-100 h-16 flex items-center">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
                </div>
                <div className="flex-none">
                    <span>{currentTime.toLocaleTimeString()} {currentTime.toLocaleDateString()}</span>
                </div>
            </header>
            <main className="min-h-[calc(100vh-64px)] h-full bg-base-200 flex flex-col items-center">
                <div className="flex flex-col items-center justify-center p-8 sm:px-0 max-w-3xl">
                    <figure>
                        <img src={mainImageData?.imageUri} alt="Image"/>
                    </figure>
                    <div className="flex space-x-2">
                        <p>Soil Moisture: {mainImageData?.soilMoisture}%</p>
                        <p>Temperature: {mainImageData?.temperature}°C</p>
                        <p>Humidity: {mainImageData?.humidity}%</p>
                    </div>
                </div>
            </main>
        </>
    );
}

export default App;
