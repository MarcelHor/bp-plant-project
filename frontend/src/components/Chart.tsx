import {useEffect, useState} from "react";
import {chartData} from "../../types/image-types";
import {getChartData} from "../../api/imageService.ts";
import {Line} from 'react-chartjs-2';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
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
import {getLatestDate} from "../../api/imageService.ts";
import {getInitialDates} from "../../utils/utils.ts";
import {useSSE} from "../../context/SSEContext.tsx";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Chart({setMainImage}: { setMainImage: Function }) {
    const [fetchedChartData, setFetchedChartData] = useState<chartData | null>(null);
    const [fromDateTime, setFromDateTime] = useState<string>("");
    const [toDateTime, setToDateTime] = useState<string>("");
    const [notFound, setNotFound] = useState<boolean>(false);
    const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
    const sseData = useSSE();

    const handleChartClick = (event: any, elements: any) => {
        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
        }
        if (elements.length === 0 || !fetchedChartData) return;

        const elementIndex = elements[0].index;
        const clickedDataId = fetchedChartData.ids[elementIndex];
        setMainImage(clickedDataId);
    };

    const fetchChartData = (from: string, to: string) => {
        getChartData(from, to).then((response: any) => {
            setFetchedChartData(response);
            setNotFound(false);
        }).catch((error: any) => {
            console.log(error);
            setNotFound(true);
        });
    };

    const updateChartData = () => {
        getLatestDate().then((response: any) => {
            const {nowLocalISO, yesterdayLocalISO} = getInitialDates(response.createdAt, 24);
            setFromDateTime(yesterdayLocalISO);
            setToDateTime(nowLocalISO);
            fetchChartData(yesterdayLocalISO, nowLocalISO);
        }).catch((error: any) => {
            console.log(error);
        });
    };

    const handleDateTimeChange = (e: any) => {
        const {name, value} = e.target;
        if (name === "fromDateTime") {
            setFromDateTime(value);
        } else {
            setToDateTime(value);
        }
        setAutoUpdate(false);
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
        updateChartData();
    }, []);

    useEffect(() => {
        if (fromDateTime && toDateTime) {
            fetchChartData(fromDateTime, toDateTime);
        }
    }, [fromDateTime, toDateTime]);

    useEffect(() => {
        if (sseData && sseData.message === 'new-data-uploaded' && autoUpdate) {
            updateChartData();
        }
    }, [sseData, autoUpdate]);

    return (
        <div className="rounded shadow-lg border-2 border-base-300 w-full p-4 h-96 flex flex-col justify-between">
            <form className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center mx-4">
                <div className="flex flex-col space-y-1">
                    <label htmlFor="fromDateTime">From</label>
                    <input type="datetime-local" id="fromDateTime" name="fromDateTime"
                           className={"input input-bordered"}
                           value={fromDateTime}
                           onChange={handleDateTimeChange}
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label htmlFor="toDateTime">To</label>
                    <input type="datetime-local" id="toDateTime" name="toDateTime"
                           className={"input input-bordered"}
                           value={toDateTime}
                           onChange={handleDateTimeChange}
                    />
                </div>
                <div className={"flex flex-1"}/>
                <div className="form-control">
                    <label className="label cursor-pointer space-x-2">
                        <span className="label-text">Auto-update</span>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={autoUpdate}
                            onChange={(e) => setAutoUpdate(e.target.checked)}
                        />
                    </label>
                </div>
                <div className="tooltip"
                     data-tip="The chart shows data from the selected time period. If the dates are more than 24 hours apart, the chart will be clustered. Auto-update will update the chart when new data is uploaded.">
                    <FontAwesomeIcon icon={faQuestionCircle} size={"lg"} className={" tooltip"}/>
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