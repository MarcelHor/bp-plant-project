import Thumbnail from "./Thumbnail.tsx";
import {getThumbnails, getClosestData} from "../../api/imageService.ts";
import {thumbnailsData} from "../../types/image-types";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faSearch, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useWebSocket} from "../../context/WebSocketContext.tsx";

export default function Drawer({thumbnailData, setMainImage, setThumbnailData, selectedThumbnailId}: {
    thumbnailData: thumbnailsData | undefined,
    setMainImage: Function,
    setThumbnailData: Function,
    selectedThumbnailId: string
}) {
    const [page, setPage] = useState<number>(1);
    const [searchDate, setSearchDate] = useState("");
    const pageRef = useRef(page);
    const socket = useWebSocket();
    const limit = 10;

    const getThumbnailData = async (page: number) => {
        if (page < 1) {
            setPage(1);
            return;
        }
        if (thumbnailData && page > thumbnailData.totalPages) {
            setPage(thumbnailData.totalPages);
            return;
        }

        try {
            const response = await getThumbnails(page, limit);
            setThumbnailData(response);
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleSearch = async () => {
        try {
            const data = await getClosestData(searchDate);
            setThumbnailData(data);
            setPage(1);
        } catch (error) {
            console.error(error);
        }
    }

    const resetSearch = async () => {
        setSearchDate("");
        setPage(1);
        await getThumbnailData(1);
    }

    useEffect(() => {
        pageRef.current = page;
    }, [page]);

    useEffect(() => {
        const handleNewData = () => {
            if (pageRef.current === 1) {
                console.log("New data uploaded, fetching new data page: " + pageRef.current);
                getThumbnails(1, 10).then((response) => {
                    setThumbnailData(response);
                }).catch((error) => {
                    console.log(error);
                });
            }
        };
        if (socket) {
            socket.on('new-data-uploaded', handleNewData);

            return () => {
                socket.off('new-data-uploaded', handleNewData);
            };
        }
    }, [socket]);


    return (
        <div className="drawer-side h-full md:h-[calc(100vh-64px)] border-r-2 border-base-300 z-20">
            <label htmlFor="my-drawer-2" className="drawer-overlay "></label>
            <div className="w-3/4 md:w-96 min-h-full bg-base-200 flex flex-col">
                <div
                    className="sticky top-0 z-10 p-2 bg-base-200 w-full shadow-lg flex flex-col items-center justify-center space-y-2">
                    <form className="form-control w-full flex flex-row space-x-2 items-center justify-center">
                        <input type="datetime-local"
                               className="input input-bordered w-2/3" value={searchDate} onChange={(e) => {
                            setSearchDate(e.target.value);
                        }}/>
                        <div className="tooltip tooltip-bottom" data-tip="Search">
                            <button type="button" className="btn btn-primary w-14" onClick={handleSearch}>
                                <FontAwesomeIcon icon={faSearch}/>
                            </button>
                        </div>
                        <div className="tooltip tooltip-bottom" data-tip="Reset">
                            <button type="button" className="btn btn-primary w-14" onClick={resetSearch}>
                                <FontAwesomeIcon icon={faXmark}/>
                            </button>
                        </div>
                    </form>
                    <div className="flex space-x-4 items-center">
                        <button
                            className="btn btn-square btn-ghost btn-sm"
                            onClick={async () => {
                                if (page > 1) {
                                    setPage(page - 1);
                                    await getThumbnailData(page - 1);
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faChevronLeft}/>
                        </button>
                        <span>{thumbnailData?.currentPage}/{thumbnailData?.totalPages}</span>
                        <button
                            className="btn btn-square btn-ghost btn-sm"
                            onClick={async () => {
                                setPage(page + 1);
                                await getThumbnailData(page + 1);
                            }}><FontAwesomeIcon icon={faChevronRight}/>
                        </button>
                    </div>
                </div>
                <div>
                    {thumbnailData &&
                        <ul className=" flex flex-col items-center justify-center">
                            {thumbnailData.thumbnails.map((thumbnail) => (
                                <Thumbnail thumbnail={thumbnail} setMainImage={setMainImage}
                                           isSelected={thumbnail.id === selectedThumbnailId} key={thumbnail.id}/>
                            ))}
                        </ul>}
                </div>
            </div>
        </div>
    )
}