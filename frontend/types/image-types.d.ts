interface imageData {
    imageUri: string;
    id: string;
    soilMoisture: number;
    temperature: number;
    humidity: number;
    createdAt: string;
}


interface thumbnailData {
    thumbnails: thumbnail[];
    page: number;
    limit: number;
}

interface thumbnail {
    id: string;
    thumbnailUri: string;
    createdAt: string;
}

interface thumbnailProps {
    thumbnail: thumbnail;
    setMainImage: (thumbnail: thumbnail) => void;
}

export type { imageData, thumbnailData, thumbnail, thumbnailProps };