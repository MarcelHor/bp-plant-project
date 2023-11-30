export const formatDate = (date: string | undefined) => {
    if (!date) {
        return '';
    }
    const dateObject = new Date(date);
    return [dateObject.toLocaleTimeString(), dateObject.toLocaleDateString()];
};