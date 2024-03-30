import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay, faDownload, faTrash} from "@fortawesome/free-solid-svg-icons";
import {formatDate} from "../../utils/utils.ts";

export default function Timelapse({data, handlePlay, handleDelete}: any) {
    const [time, date] = formatDate(data.createdAt);

    return (
        <li key={data.id} className="flex flex-col items-center m-2 p-2 col-span-1">
            <img src={import.meta.env.VITE_BACKEND_URL + '/thumbnails/' + data.thumbnail} alt=""
                 className="w-full h-auto rounded"/>
            <div className="flex justify-between items-center w-full">
                <div className="flex flex-col items-start mt-2">
                    <span className="text-md md:text-sm">{date}</span>
                    <span className="text-sm md:text-xs">{time}</span>
                </div>
                <div className="flex space-x-1 items-center ">
                    <button className="btn btn-primary btn-sm" onClick={() => handlePlay(data.id)}><FontAwesomeIcon
                        icon={faPlay}/>
                    </button>
                    <a href={`${import.meta.env.VITE_BACKEND_URL}/timelapses/${data.id}.mp4?download=true`}
                       download={`timelapse_${data.id}.mp4`}
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