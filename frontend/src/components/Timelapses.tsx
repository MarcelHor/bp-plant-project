import {useState, useEffect} from "react";
import {getTimelapses} from "../../api/timelapseService.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import Timelapse from "./Timelapse.tsx";

interface timelapse {
    id: string;
    createdAt: string;
    thumbnail: string;
}

interface timelapseResponse {
    timelapses: timelapse[];
    totalPages: number;
}

export default function Timelapses() {
    const [timelapses, setTimelapses] = useState<timelapseResponse>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 8;

    useEffect(() => {
        const fetchTimelapses = async () => {
            try {
                const data = await getTimelapses(currentPage, limit);
                setTimelapses(data);
                setTotalPages(data.totalPages);
            } catch (error: any) {
                console.error("Failed to fetch timelapses:", error.message);
            }
        };

        fetchTimelapses();
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="w-full h-full flex flex-col justify-between items-center ">
            <div className={"w-full"}>
                <h1 className="text-2xl font-bold mb-8">Timelapses</h1>
                <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    {timelapses?.timelapses.map((timelapse: timelapse) => (
                        <Timelapse key={timelapse.id} {...timelapse}/>
                    ))}
                </ul>
            </div>
            <div className="flex justify-center items-center space-x-2">
                <button
                    className="btn btn-primary w-12"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FontAwesomeIcon icon={faChevronLeft}/>
                </button>
                <span className="text-xl font-bold">{currentPage}</span>
                <button
                    className="btn btn-primary w-12"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <FontAwesomeIcon icon={faChevronRight}/>
                </button>
            </div>
        </div>
    );
}
