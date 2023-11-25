import {thumbnail} from "../../types/image-types";
import {formatDate} from "../../utils/utils.ts";

export default function Thumbnail({thumbnail, setMainImage}: { thumbnail: thumbnail, setMainImage: Function }) {
    const [time, date] = formatDate(thumbnail.createdAt);

    return (
        <li className={"flex items-center justify-center px-2 space-x-4"} onClick={() => setMainImage(thumbnail)}>
            <div className={"flex flex-col"}>
                <span>{time}</span>
                <div>{date}</div>
            </div>
            <img src={thumbnail.thumbnailUri} alt="Thumbnail" className={"rounded"}/>
        </li>
    );
}