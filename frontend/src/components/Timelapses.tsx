import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import Timelapse from "./Timelapse.tsx";
import {timelapse, timelapseResponse} from "../../types/image-types";

export default function Timelapses({timelapsesData, currentPage, totalPages, handlePageChange, fetchTimelapses}: {
    timelapsesData: timelapseResponse | undefined,
    currentPage: number,
    totalPages: number,
    handlePageChange: (newPage: number) => void,
    fetchTimelapses: (page: number, limit?: number) => void
}) {
    return (
        <div className="w-full h-full flex flex-col justify-between items-center ">
            <div className={"w-full"}>
                <h1 className="text-2xl font-bold mb-8">Timelapses</h1>
                <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    {timelapsesData?.timelapses.map((timelapse: timelapse) => (
                        <Timelapse key={timelapse.id} timelapse={timelapse} fetchTimelapses={fetchTimelapses} currentPage={currentPage}/>
                    ))}
                </ul>
            </div>
            <div className="flex justify-center items-center space-x-2">
                <button
                    className="btn btn-primary w-12"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <FontAwesomeIcon icon={faChevronLeft}/>
                </button>
                <span className="text-xl font-bold">{currentPage}</span>
                <button
                    className="btn btn-primary w-12"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    <FontAwesomeIcon icon={faChevronRight}/>
                </button>
            </div>
        </div>
    );
}
