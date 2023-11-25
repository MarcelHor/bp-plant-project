import {useEffect, useState} from "react";
import {chartData} from "../../types/image-types";
import {getChartData} from "../../api/imageService.ts";
import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Chart() {
    const [fetchedChartData, setFetchedChartData] = useState<chartData | null>(null);
    const [fromDateTime, setFromDateTime] = useState<string>("2023-01-01T00:00:00.000Z");
    const [toDateTime, setToDateTime] = useState<string>("2023-12-31T00:00:00.000Z");

    const chartData = fetchedChartData ? {
        labels: fetchedChartData.labels,
        datasets: [
            {
                label: 'Temperature',
                data: fetchedChartData.temperatureData,
                fill: false,
                borderColor: 'rgb(234,165,0)',
            },
            {
                label: 'Humidity',
                data: fetchedChartData.humidityData,
                fill: false,
                borderColor: 'rgb(79,159,240)',
            },
            {
                label: 'Soil Moisture',
                data: fetchedChartData.soilMoistureData,
                fill: false,
                borderColor: 'rgb(0,126,0)',
            }
        ],
    } : {};

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                display: true,
            },
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Time'
                },
                ticks: {
                    display: false,
                }
            }
        }
    };

    useEffect(() => {

        getChartData(fromDateTime, toDateTime).then((response: any) => {
            setFetchedChartData(response);
        }).catch((error: any) => {
            console.log(error);
        });
    }), [fromDateTime, toDateTime]

    return (
        <div className="w-full rounded shadow-lg border-2 p-4 h-80">
            {fetchedChartData && <Line data={chartData} options={options}/>}
        </div>
    );
}