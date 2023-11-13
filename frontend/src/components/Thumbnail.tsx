interface thumbnail {
    id: string;
    thumbnailUri: string;
    createdAt: string;
}

interface ThumbnailProps {
    thumbnail: thumbnail;
    setMainImage: (thumbnail: thumbnail) => void;
}

export default function Thumbnail({thumbnail, setMainImage}: ThumbnailProps) {

    const formatDate = (date: string | undefined) => {
        if (!date) {
            return '';
        }
        const dateObject = new Date(date);
        return [dateObject.toLocaleTimeString() , dateObject.toLocaleDateString()];
    }

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