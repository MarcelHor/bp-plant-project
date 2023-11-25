interface imageData {
    imageUri: string;
    id: string;
    soilMoisture: number;
    temperature: number;
    humidity: number;
    createdAt: string;
}


interface thumbnailsData {
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

interface chartData {
    labels: string[],
    temperatureData: number[],
    humidityData: number[],
    soilMoistureData: number[],
}

export type { imageData, thumbnailsData, thumbnail, thumbnailProps, chartData };