interface imageData {
    imageUri: string;
    id: string;
    soilMoisture: number;
    temperature: number;
    humidity: number;
    light: number;
    createdAt: string;
}


interface thumbnailsData {
    thumbnails: thumbnail[];
    totalPages: number;
    currentPage: number;
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
    ids: string[],
    labels: string[],
    temperatureData: number[],
    humidityData: number[],
    soilMoistureData: number[],
    lightData: number[]
}

export type { imageData, thumbnailsData, thumbnail, thumbnailProps, chartData };