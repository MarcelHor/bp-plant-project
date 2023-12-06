import Header from "../components/Header.tsx";
import TimelapsesDrawer from "../components/TimelapsesDrawer.tsx";
import Timelapses from "../components/Timelapses.tsx";
import {useEffect, useState} from "react";
import {imageData} from "../../types/image-types";
import {getLatest} from "../../api/imageService.ts";

export default function Home() {
    const [latestData, setLatestData] = useState<imageData>();

    useEffect(() => {
        getLatest().then((response: any) => {
            setLatestData(response);
        }).catch((error: any) => {
            console.log(error);
        });
    }, []);

    return (
        <div className={"flex flex-col h-screen"}>
            <Header/>
            <main className="flex flex-1 overflow-hidden mt-16">
                <div className="drawer md:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle "/>
                    {/* Main Content */}
                    <div
                        className="drawer-content flex flex-col items-center bg-base-200 overflow-y-auto h-full">
                        <div className="flex items-center p-4 w-full space-x-4 lg:hidden">
                            <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open
                                drawer</label>
                        </div>
                        <div className="flex flex-col items-center justify-center max-w-7xl w-full h-full space-y-8 py-8 px-4">
                            <Timelapses/>
                        </div>
                    </div>
                    {/* Sidebar */}
                    {latestData && <TimelapsesDrawer latestDate={latestData.createdAt}/>}
                </div>
            </main>
        </div>
    );
}