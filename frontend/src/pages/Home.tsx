import {useState, useEffect} from 'react';
import {getByID, getLatest} from "../../api/imageService.ts";
import {imageData} from "../../types/image-types";
import ImageDisplay from "../components/ImageDisplay.tsx";
import Chart from "../components/Chart.tsx";
import Drawer from "../components/Drawer.tsx";
import LayoutComponent from "../components/PageLayout.tsx";
import {useSSE} from "../../context/SSEContext.tsx";
import AIModel from "../components/AIModel.tsx";

export default function Home() {
    const [mainImageData, setMainImageData] = useState<imageData>();
    const [selectedThumbnailId, setSelectedThumbnailId] = useState<string>("");
    const sseData = useSSE();

    const setMainImage = async (id: string) => {
        try {
            const response = await getByID(id);
            setMainImageData(response);
            setSelectedThumbnailId(id);
        } catch (error: unknown) {
            console.log(error);
        }
    }

    useEffect(() => {
        getLatest().then((response) => {
            setMainImageData(response);
        }).catch((error: unknown) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        if (sseData && sseData.message === 'new-data-uploaded' && selectedThumbnailId.length === 0) {
            getLatest().then((response) => {
                setMainImageData(response);
            }).catch((error: unknown) => {
                console.log(error);
            });
        }
    }, [sseData, selectedThumbnailId]);

    return (
        <LayoutComponent
            mainContent={<>
                <ImageDisplay mainImageData={mainImageData}/>
                <Chart setMainImage={setMainImage}/>
                <AIModel mainImageData={mainImageData}/>
            </>}
            sidebar={<Drawer setMainImage={setMainImage}
                             selectedThumbnailId={selectedThumbnailId}
            />}
        />
    );
}