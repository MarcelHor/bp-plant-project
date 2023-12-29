/**
 * Formats the date to a readable format (time and date)
 * @param date - the date to be formatted
 * @returns the formatted date as array of time and date
 */
export const formatDate = (date: string | undefined) => {
    if (!date) {
        return '';
    }
    const dateObject = new Date(date);
    return [dateObject.toLocaleTimeString(), dateObject.toLocaleDateString()];
};

export function getInitialDates(latestDate: string, backValue: number) {
    const now = new Date(latestDate);
    const yesterday = new Date(now);
    yesterday.setHours(now.getHours() - backValue);
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const nowLocalISO = new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
    const yesterdayLocalISO = new Date(yesterday.getTime() - timezoneOffset).toISOString().slice(0, 16);
    return {nowLocalISO, yesterdayLocalISO};
}
