import {useState, useEffect} from 'react';
import {getByID, getThumbnails, getLatest} from "../../api/imageService.ts";
import {imageData, thumbnailsData} from "../../types/image-types";
import ImageDisplay from "../components/ImageDisplay.tsx";
import Header from "../components/Header";
import Chart from "../components/Chart.tsx";
import Drawer from "../components/Drawer.tsx";


export default function Home() {
    const [mainImageData, setMainImageData] = useState<imageData>();
    const [thumbnailData, setThumbnailData] = useState<thumbnailsData>();

    // initial fetch
    useEffect(() => {
        getLatest().then((response: any) => {
            setMainImageData(response);
        }).catch((error: any) => {
            console.log(error);
        });

        getThumbnails(1, 10).then((response: any) => {
            setThumbnailData(response);
        }).catch((error: any) => {
            console.log(error);
        });

    }, []);

    const setMainImage = async (id: string) => {
        try {
            const response = await getByID(id);
            setMainImageData(response);
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <div className={"flex flex-col h-screen"}>
            <Header/>
            <main className="flex flex-1 overflow-hidden mt-16">
                <div className="drawer md:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle "/>
                    {/* Main Content */}
                    <div
                        className="drawer-content flex flex-col items-center bg-base-200 overflow-y-auto h-full">
                        <div className="flex items-center p-4 w-full space-x-4">
                            <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open
                                drawer</label>
                        </div>
                        <div className="flex flex-col items-center justify-center max-w-7xl space-y-8 py-8 px-4">
                            <ImageDisplay mainImageData={mainImageData}/>
                            <Chart setMainImage={setMainImage}/>
                        </div>
                    </div>
                    {/* Drawer */}
                    <Drawer thumbnailData={thumbnailData} setMainImage={setMainImage} setThumbnailData={setThumbnailData}/>
                </div>
            </main>
        </div>
    );
}