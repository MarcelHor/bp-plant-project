import TimelapsesDrawer from "../components/TimelapsesDrawer.tsx";
import Timelapses from "../components/Timelapses.tsx";
import LayoutComponent from "../components/PageLayout.tsx";
import {useEffect, useState} from "react";
import {imageData, timelapseResponse} from "../../types/image-types";
import {getLatest} from "../../api/imageService.ts";
import {getTimelapses} from "../../api/timelapseService.ts";



export default function Home() {
    const [latestData, setLatestData] = useState<imageData>();
    const [timelapsesData, setTimelapsesData] = useState<timelapseResponse>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchTimelapses = async (page: number = 1, limit: number = 8) => {
        try {
            const data = await getTimelapses(page, limit);
            setTotalPages(data.totalPages);
            setTimelapsesData(data);
        } catch (error: unknown) {
            console.error("Failed to fetch timelapses:", error);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) {
            return;
        }
        setCurrentPage(newPage);
        fetchTimelapses(newPage);
    };

    useEffect(() => {
        getLatest().then((response) => {
            setLatestData(response);
        }).catch((error: unknown) => {
            console.log(error);
        });

        fetchTimelapses(currentPage);
    }, []);

    return (
        <LayoutComponent
            mainContent={<>
                <Timelapses timelapsesData={timelapsesData} currentPage={currentPage} totalPages={totalPages}
                            handlePageChange={handlePageChange} fetchTimelapses={fetchTimelapses}/>
            </>}

            sidebar={latestData && <TimelapsesDrawer latestDate={latestData.createdAt} fetchTimelapses={fetchTimelapses}
                                                     currentPage={currentPage}/>}
        />
    );
}