import {imageData} from "../../types/image-types";
import {formatDate} from "../../utils/utils.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDroplet, faTemperatureThreeQuarters, faWind, faClock, faLightbulb} from "@fortawesome/free-solid-svg-icons";
import {faFaceSmileBeam} from "@fortawesome/free-regular-svg-icons/faFaceSmileBeam";

export default function ImageDisplay({mainImageData}: { mainImageData: imageData | undefined }) {
    const [time, date] = formatDate(mainImageData?.createdAt);

    const thresholdValues = {
        soilMoisture: {low: 30, high: 101},
        light: {low: 10, high: 101},
        temperature: {low: 15, high: 28},
        humidity: {low: 40, high: 60}
    };

    const isValueOutOfRange = (value: number | undefined, threshold: { low: number, high: number }) => {
        if (value === undefined) return false;
        return value < threshold.low || value > threshold.high;
    };

    const hasWarning = isValueOutOfRange(mainImageData?.soilMoisture, thresholdValues.soilMoisture) ||
        isValueOutOfRange(mainImageData?.light, thresholdValues.light) ||
        isValueOutOfRange(mainImageData?.temperature, thresholdValues.temperature) ||
        isValueOutOfRange(mainImageData?.humidity, thresholdValues.humidity);

    return (
        <div
            className="flex-col lg:flex-row flex items-center justify-around rounded shadow-lg border-2 border-base-300">
            <figure>
                <img src={mainImageData?.imageUri} className={"md:rounded"} alt="Image"/>
            </figure>
            <div className="flex flex-col w-full p-4 h-full justify-around">
                <div className={""}>
                    <h2 className="text-xl md:text-2xl text-center font-bold mb-4">Sensor Data</h2>
                    <div className="flex items-start justify-around">
                        <div className="flex flex-col items-start space-y-4">
                            <p><FontAwesomeIcon icon={faClock} className={"mr-1"}
                                                size={"lg"}/>&nbsp;{time} {date}
                            </p>
                            <p><FontAwesomeIcon icon={faDroplet} className={"mr-2"}
                                                size={"lg"}/>&nbsp;Soil Moisture: <span
                                className={"font-bold"}>{mainImageData?.soilMoisture.toFixed(2)}%</span></p>
                            <p><FontAwesomeIcon icon={faLightbulb} className={"mr-2"}
                                                size={"lg"}/>&nbsp;Light Intensity: <span
                                className={"font-bold"}>{mainImageData?.light.toFixed(2)}%</span></p>
                        </div>
                        <div className="flex flex-col items-start space-y-4">
                            <p><FontAwesomeIcon icon={faTemperatureThreeQuarters} className={"mr-2 w-6"}
                                                size={"lg"}/>&nbsp;Temperature: <span
                                className={"font-bold"}>{mainImageData?.temperature}°C</span></p>
                            <p><FontAwesomeIcon icon={faWind} size={"lg"}
                                                className={"mr-2 w-6"}/>&nbsp;Humidity: <span
                                className={"font-bold"}>{mainImageData?.humidity}%</span></p>
                        </div>
                    </div>
                </div>

                {hasWarning ? (
                    <div className="mt-8 p-2 bg-warning rounded mb-4">
                        <h3 className={"text-xl font-bold"}>Warning !</h3>
                        <ul className={"ml-1 list-disc list-inside"}>
                            {isValueOutOfRange(mainImageData?.soilMoisture, thresholdValues.soilMoisture) &&
                                <li>Soil Moisture is out of range</li>}
                            {isValueOutOfRange(mainImageData?.light, thresholdValues.light) &&
                                <li>Light Intensity is out of range</li>}
                            {isValueOutOfRange(mainImageData?.temperature, thresholdValues.temperature) &&
                                <li>Temperature is out of range</li>}
                            {isValueOutOfRange(mainImageData?.humidity, thresholdValues.humidity) &&
                                <li>Humidity is out of range</li>}
                        </ul>
                    </div>
                ) : (
                    <div className="p-2 rounded flex flex-col justify-center items-center mb-4">
                        {/*@ts-ignore*/}
                        <FontAwesomeIcon icon={faFaceSmileBeam} size={"6x"}/>
                        <span className={"text-lg font-semibold mt-2"}>Everything is fine and healthy</span>
                    </div>
                )}
            </div>
        </div>
    )
}
