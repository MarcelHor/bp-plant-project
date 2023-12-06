import {useEffect, useState} from "react";
import {chartData} from "../../types/image-types";
import {getChartData} from "../../api/imageService.ts";
import {Line} from 'react-chartjs-2';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
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
import {getInitialDates} from "../../utils/utils.ts";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Chart({setMainImage, latestDate}: { setMainImage: Function, latestDate: string }) {
    const {nowLocalISO, yesterdayLocalISO} = getInitialDates(latestDate, 8);
    const [fetchedChartData, setFetchedChartData] = useState<chartData | null>(null);
    const [fromDateTime, setFromDateTime] = useState<string>(yesterdayLocalISO);
    const [toDateTime, setToDateTime] = useState<string>(nowLocalISO);
    const [notFound, setNotFound] = useState<boolean>(false);

    //@ts-ignore
    const handleChartClick = (event: any, elements: any) => {
        if (elements.length === 0 || !fetchedChartData) return;
        const elementIndex = elements[0].index;
        const clickedDataId = fetchedChartData.ids[elementIndex];
        setMainImage(clickedDataId);
    };

    const chartData = {
        labels: fetchedChartData?.labels || [],
        datasets: fetchedChartData ? [
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
            },
            {
                label: 'Light',
                data: fetchedChartData.lightData,
                fill: false,
                borderColor: 'rgb(255,255,0)',
            }
        ] : []
    };


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
        },
        legend: {
            display: true,
        },
        onClick: handleChartClick,
    };

    useEffect(() => {
        getChartData(fromDateTime, toDateTime).then((response: any) => {
            setFetchedChartData(response);
            setNotFound(false);
        }).catch((error: any) => {
            console.log(error);
            setNotFound(true);
        });
    }, [fromDateTime, toDateTime]);

    return (
        <div className="rounded shadow-lg border-2 border-base-300 w-full p-4 h-96 flex flex-col justify-between">
            <form className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <div className="flex flex-col space-y-1">
                    <label htmlFor="fromDateTime">From</label>
                    <input type="datetime-local" id="fromDateTime" name="fromDateTime"
                           className={"input input-bordered"}
                           value={fromDateTime}
                           onChange={(e) => setFromDateTime(e.target.value)}
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label htmlFor="toDateTime">To</label>
                    <input type="datetime-local" id="toDateTime" name="toDateTime"
                           className={"input input-bordered"}
                           value={toDateTime}
                           onChange={(e) => setToDateTime(e.target.value)}
                    />
                </div>
            </form>
            <div className="w-full h-64">
                {!notFound ? (
                    <>{fetchedChartData && <Line data={chartData} options={options}/>} </>) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="flex flex-col    items-center justify-center space-y-2 text-3xl">
                            <FontAwesomeIcon icon={faExclamationTriangle} size={"xl"} className={"mr-1"}/>
                            <span>No data found</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}