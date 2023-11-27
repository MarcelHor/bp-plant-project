import {thumbnail} from "../../types/image-types";
import {formatDate} from "../../utils/utils.ts";

export default function Thumbnail({thumbnail, setMainImage}: { thumbnail: thumbnail, setMainImage: Function }) {
    const [time, date] = formatDate(thumbnail.createdAt);

    return (
        <li className={"flex items-center justify-center px-12 md:px-4 space-x-4"}
            onClick={() => setMainImage(thumbnail.id)}>
            <div className={"flex flex-col text-sm md:text-md"}>
                <span>{time}</span>
                <div>{date}</div>
            </div>
            <img src={thumbnail.thumbnailUri} alt="Thumbnail" className={"rounded object-scale-down"}/>
        </li>
    );
}