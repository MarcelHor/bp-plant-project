import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import Timelapse from "./Timelapse.tsx";
import {timelapseData, timelapseResponse} from "../../types/image-types";
import {createRef, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export default function Timelapses({timelapsesData, currentPage, totalPages, handlePageChange, handleDelete}: {
    timelapsesData: timelapseResponse | undefined,
    currentPage: number,
    totalPages: number,
    handlePageChange: (newPage: number) => void,
    handleDelete: (timelapse: timelapseData) => void
}) {
    const [selectedTimelapseID, setSelectedTimelapseID] = useState<number | null>(null);
    const [lastClickTime, setLastClickTime] = useState<number>(Date.now());
    const videoRef = createRef<HTMLVideoElement>();
    const modalRef = createRef<HTMLDialogElement>();
    const {t} = useTranslation();

    const handlePlay = (id: number) => {
        setSelectedTimelapseID(id);
        setLastClickTime(Date.now());
    }



    useEffect(() => {
        if (selectedTimelapseID) {
            videoRef.current?.load();
            modalRef.current?.showModal();
        }
    }, [selectedTimelapseID, lastClickTime]);


    return (
        <>
            {timelapsesData?.timelapses.length === 0 ? (
                <div className="w-full h-full flex flex-col justify-center items-center space-y-2">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-9xl text-gray-400"/>
                    <h1 className="text-2xl font-bold mb-8">{t("timelapses.noTimelapses")}</h1>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col justify-between items-center ">
                    <div className={"w-full"}>
                        <h1 className="text-2xl font-bold mb-8">{t("timelapses.title")}</h1>
                        <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                            {timelapsesData?.timelapses.map((data: timelapseData) => (
                                <Timelapse key={data.id} data={data} handlePlay={handlePlay}
                                            handleDelete={() => handleDelete(data)}/>
                            ))}
                        </ul>
                    </div>
                    {selectedTimelapseID &&
                        <dialog id="my_modal_3" className="modal bg-black bg-opacity-80 " ref={modalRef}>
                            <div className="modal-box w-11/12 max-w-5xl bg-transparent shadow-none">
                                <div className="modal-body">
                                    <video className="h-auto" controls ref={videoRef}>
                                        <source
                                            src={import.meta.env.VITE_BACKEND_URL + "/timelapses/" + selectedTimelapseID + ".mp4"}
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
