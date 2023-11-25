import Thumbnail from "./Thumbnail.tsx";
import {thumbnailsData} from "../../types/image-types";

export default function Drawer({thumbnailData, setMainImage}: { thumbnailData: thumbnailsData | undefined, setMainImage: Function }) {

    return (
        <div className="drawer-side h-full md:h-[calc(100vh-64px)] border-r-2">
            <label htmlFor="my-drawer-2" className="drawer-overlay "></label>
            <div className="w-96 min-h-full bg-base-200 flex flex-col">
                <div className="sticky top-0 z-10 p-4 bg-base-200 w-full shadow-lg">
                    <form>
                        <input type="text" placeholder="Search..."
                               className="input input-bordered w-full"/>
                    </form>
                </div>
                <div>
                    {thumbnailData &&
                        <ul className="overflow-y-auto space-y-4 flex flex-col items-center justify-center">
                            {thumbnailData.thumbnails.map((thumbnail) => (
                                <div key={thumbnail.id} className={"w-full border-b-2 p-4"}>
                                    <Thumbnail thumbnail={thumbnail} setMainImage={setMainImage}/>
                                </div>
                            ))}
                        </ul>}
                </div>
            </div>
        </div>
    )
}