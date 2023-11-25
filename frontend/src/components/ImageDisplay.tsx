import {imageData} from "../../types/image-types";
import {formatDate} from "../../utils/utils.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDroplet, faTemperatureThreeQuarters, faWind, faClock} from "@fortawesome/free-solid-svg-icons";

export default function ImageDisplay({mainImageData}: { mainImageData: imageData | undefined }) {
    const [time, date] = formatDate(mainImageData?.createdAt);

    return (
        <div className="flex-col md:flex-row flex items-center justify-around rounded shadow-lg border-2">
            <figure>
                <img src={mainImageData?.imageUri} className={"md:rounded"} alt="Image"/>
            </figure>
            <div className="flex flex-col w-full p-4 h-full">
                <h2 className="text-xl md:text-2xl text-center font-bold mb-4">Sensor Data</h2>
                <div className="flex items-center justify-around ">
                    <div className="flex flex-col items-start space-y-4">
                        <p><FontAwesomeIcon icon={faClock} className={"mr-1"}
                                            size={"lg"}/>&nbsp;{time} {date}</p>
                        <p><FontAwesomeIcon icon={faDroplet} className={"mr-2"}
                                            size={"lg"}/>&nbsp;Soil Moisture: <span
                            className={"font-bold"}>{mainImageData?.soilMoisture}%</span></p>
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
                <p className="mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus adipisci
                    aliquam asperiores atque autem consequatur cumque cupiditate delectus dicta
                    doloribus ea earum eius eligendi error esse est et eum eveniet excepturi
                </p>
            </div>
        </div>
    )
}
