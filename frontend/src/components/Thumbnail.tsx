import {thumbnail} from "../../types/image-types";
import {formatDate} from "../../utils/utils.ts";

export default function Thumbnail({thumbnail, setMainImage, isSelected}: {
    thumbnail: thumbnail,
    setMainImage: (id: string) => void,
    isSelected: boolean
}) {
    const [time, date] = formatDate(thumbnail.createdAt);
    return (
        <li
             className={`w-full border-b-2 border-base-300 p-4  cursor-pointer ${isSelected ? "bg-neutral-300" : "hover:bg-neutral-200"}`}>
        <div className={`flex items-center justify-center px-12 md:px-4 space-x-4 `}
            onClick={() => setMainImage(thumbnail.id)}>
            <div className={"flex flex-col text-sm md:text-md"}>
                <span>{time}</span>
                <div>{date}</div>
            </div>
            <img src={`${import.meta.env.VITE_BACKEND_URL}${thumbnail.thumbnailUri}`} alt="Thumbnail" className={"rounded object-scale-down"}/>
        </div>
        </li>
    );
}