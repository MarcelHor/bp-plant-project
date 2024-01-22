import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay, faDownload, faTrash} from "@fortawesome/free-solid-svg-icons";
import {formatDate} from "../../utils/utils.ts";
import {deleteTimelapse} from "../../api/timelapseService.ts";

export default function Timelapse({timelapse, fetchTimelapses, currentPage, handlePlay}: any) {
    const [time, date] = formatDate(timelapse.createdAt);

    const handleDelete = async () => {
        const confirm = window.confirm("Are you sure you want to delete this timelapse?");
        if (!confirm) return;
        try {
            await deleteTimelapse(timelapse.id);
            await fetchTimelapses(currentPage);
        } catch (error: any) {
            console.error("Failed to delete timelapse:", error.message);
        }
    }
    return (
        <li key={timelapse.id} className="flex flex-col items-center m-2 p-2 col-span-1">
            <img src={"http://localhost:3000/thumbnails/" + timelapse.thumbnail} alt=""
                 className="w-full h-auto rounded"/>
            <div className="flex justify-between items-center w-full">
                <div className="flex flex-col items-start mt-2">
                    <span className="text-md md:text-sm">{date}</span>
                    <span className="text-sm md:text-xs">{time}</span>
                </div>
                <div className="flex space-x-1 items-center ">
                    <button className="btn btn-primary btn-sm" onClick={() => handlePlay(timelapse.id)}><FontAwesomeIcon icon={faPlay}/>
                    </button>
                    <a href={`http://localhost:3000/timelapses/${timelapse.id}.mp4?download=true`}
                       download={`timelapse_${timelapse.id}.mp4`}
                       className="btn btn-warning btn-sm">
                        <FontAwesomeIcon icon={faDownload}/>
                    </a>
                    <button className="btn btn-error btn-sm" onClick={handleDelete}><FontAwesomeIcon icon={faTrash}/>
                    </button>
                </div>
            </div>
        </li>
    )
}