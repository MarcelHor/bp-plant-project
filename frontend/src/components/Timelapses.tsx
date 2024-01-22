import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import Timelapse from "./Timelapse.tsx";
import {timelapse, timelapseResponse} from "../../types/image-types";
import {createRef, useEffect, useState} from "react";

export default function Timelapses({timelapsesData, currentPage, totalPages, handlePageChange, fetchTimelapses}: {
    timelapsesData: timelapseResponse | undefined,
    currentPage: number,
    totalPages: number,
    handlePageChange: (newPage: number) => void,
    fetchTimelapses: (page: number, limit?: number) => void
}) {
    const [selectedTimelapseID, setSelectedTimelapseID] = useState<number | null>(null);
    const videoRef = createRef<HTMLVideoElement>();
    const modalRef = createRef<HTMLDialogElement>();

    const handlePlay = (id: number) => {
        setSelectedTimelapseID(id);
    }

    useEffect(() => {
        if (selectedTimelapseID) {
            videoRef.current?.load();
            modalRef.current?.showModal();
        }
    }, [selectedTimelapseID]);

    return (
        <>
            {timelapsesData?.timelapses.length === 0 ? (
                <div className="w-full h-full flex flex-col justify-center items-center space-y-2">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-9xl text-gray-400"/>
                    <h1 className="text-2xl font-bold mb-8">No timelapses created yet.</h1>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col justify-between items-center ">
                    <div className={"w-full"}>
                        <h1 className="text-2xl font-bold mb-8">Timelapses</h1>
                        <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                            {timelapsesData?.timelapses.map((timelapse: timelapse) => (
                                <Timelapse key={timelapse.id} timelapse={timelapse} fetchTimelapses={fetchTimelapses}
                                           currentPage={currentPage} handlePlay={handlePlay}/>
                            ))}
                        </ul>
                    </div>
                    {selectedTimelapseID &&
                        <dialog id="my_modal_3" className="modal bg-black bg-opacity-80 " ref={modalRef}>
                            <div className="modal-box w-11/12 max-w-5xl bg-transparent shadow-none">
                                <div className="modal-body">
                                    <video className="h-auto" controls ref={videoRef}>
                                        <source src={"http://localhost:3000/timelapses/" + selectedTimelapseID + ".mp4"}
                                                type="video/mp4"/>
                                    </video>
                                </div>
                            </div>
                            <form method="dialog" className="modal-backdrop">
                                <button>close</button>
                            </form>
                        </dialog>}
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
            )}
        </>
    );
}
