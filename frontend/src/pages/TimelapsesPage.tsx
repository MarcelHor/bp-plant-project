import TimelapsesDrawer from "../components/TimelapsesDrawer.tsx";
import Timelapses from "../components/Timelapses.tsx";
import LayoutComponent from "../components/PageLayout.tsx";
import {useEffect, useState} from "react";
import {imageData, timelapseData, timelapseResponse} from "../../types/image-types";
import {getLatest} from "../../api/imageService.ts";
import {deleteTimelapse, getTimelapses} from "../../api/timelapseService.ts";


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
            const emptyData: timelapseResponse = {timelapses: [], totalPages: 0};
            setTimelapsesData(emptyData);
        }
    };

    const handleDelete = async (timelapse: timelapseData) => {
        const confirm = window.confirm("Are you sure you want to delete this timelapse?");
        if (!confirm) return;
        try {
            await deleteTimelapse(timelapse.id);
            const newTimelapses = timelapsesData?.timelapses.filter((t) => t.id !== timelapse.id) || [];
            if (newTimelapses.length === 0 && currentPage > 1) {
                setCurrentPage(currentPage - 1); // Move to the previous page
                await fetchTimelapses(currentPage - 1);
            } else {
                setTimelapsesData({timelapses: newTimelapses, totalPages: totalPages});
            }
        } catch (error: any) {
            console.error("Failed to delete timelapse:", error.message);
        }
    }

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
                            handlePageChange={handlePageChange} handleDelete={handleDelete}/>
            </>}

            sidebar={latestData && <TimelapsesDrawer latestDate={latestData.createdAt} fetchTimelapses={fetchTimelapses}
                                                     currentPage={currentPage}/>}
        />
    );
}