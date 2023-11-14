import {useState, useEffect} from 'react';
import Header from "./components/Header";
import Thumbnail from "./components/Thumbnail.tsx";
import {getByID, getThumbnails, getLatest} from "../api/imageService.ts";
import {imageData, thumbnailData, thumbnail} from "../types/image-types";
import {formatDate} from "../utils/utils.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDroplet, faTemperatureThreeQuarters, faWind, faClock} from "@fortawesome/free-solid-svg-icons";
import {multi}



function App() {
    const [mainImageData, setMainImageData] = useState<imageData>();
    const [thumbnailData, setThumbnailData] = useState<thumbnailData>();
    const [time, date] = formatDate(mainImageData?.createdAt);

    useEffect(() => {
        getLatest().then((response: any) => {
            setMainImageData(response);
        }).catch((error: any) => {
            console.log(error);
        });
        getThumbnails(1, 10).then((response: any) => {
            setThumbnailData(response);
            console.log(response);
        }).catch((error: any) => {
            console.log(error);
        });
    }, []);

    const setMainImage = async (thumbnail: thumbnail) => {
        try {
            const response = await getByID(thumbnail.id);
            setMainImageData(response);
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <>
            <Header/>
            <main
                className="min-h-[calc(100vh-64px)] h-full flex flex-col items-center relative">
                <div className="drawer md:drawer-open h-full">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle "/>

                    {/*Main Content*/}
                    <div className="drawer-content flex flex-col items-center bg-base-200">

                        <div className="flex items-center p-8 w-full space-x-4">
                            <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open
                                drawer</label>
                            <button className="btn btn-primary">Timelapse</button>
                        </div>

                        <div
                            className="flex flex-col items-center justify-center max-w-5xl">
                            <figure>
                                <img src={mainImageData?.imageUri} className={"rounded"} alt="Image"/>
                            </figure>

                            <div className="flex flex-col mt-8 w-full shadow-lg rounded p-2">
                                <h2 className="text-2xl text-center font-bold">Sensor Data</h2>
                                <div className="flex items-center justify-around h-24">
                                    <div className="flex flex-col items-start space-y-4">
                                        <p><FontAwesomeIcon icon={faClock} className={"mr-1"} size={"lg"}/>&nbsp;{time} {date}</p>
                                        <p><FontAwesomeIcon icon={faDroplet} className={"mr-2"} size={"lg"}/>&nbsp;Soil Moisture: <span className={"font-bold"}>{mainImageData?.soilMoisture}%</span></p>
                                    </div>
                                    <div className="flex flex-col items-start space-y-4">
                                        <p><FontAwesomeIcon icon={faTemperatureThreeQuarters} className={"mr-2 w-6"} size={"lg"}/>&nbsp;Temperature: <span className={"font-bold"}>{mainImageData?.temperature}°C</span></p>
                                        <p><FontAwesomeIcon icon={faWind} size={"lg"} className={"mr-2 w-6"}/>&nbsp;Humidity: <span className={"font-bold"}>{mainImageData?.humidity}%</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col mt-8 w-full shadow-lg rounded p-2">
                                <h2 className="text-2xl text-center font-bold">Graph</h2>



                            </div>
                        </div>
                    </div>

                    {/*Drawer*/}
                    <div className="drawer-side h-full md:h-[calc(100vh-64px)] border-r-2">
                        <label htmlFor="my-drawer-2" className="drawer-overlay "></label>
                        <div className="w-96 min-h-full bg-base-200 flex flex-col">

                            <div className="sticky top-0 z-10 p-4 bg-base-200 w-full shadow-lg">
                                <form>
                                    <input type="text" placeholder="Search..."
                                           className="input input-bordered w-full"/>
                                </form>
                            </div>

                            <div>
                                {thumbnailData &&
                                    <ul className="overflow-y-auto space-y-4  flex flex-col items-center justify-center">
                                        {thumbnailData.thumbnails.map((thumbnail) => (
                                            <div key={thumbnail.id} className={"w-full border-b-2 p-2"}>
                                                <Thumbnail thumbnail={thumbnail} setMainImage={setMainImage}/>
                                            </div>
                                        ))}
                                    </ul>}
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default App;
