export const fetchDataFromAPI = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not OK")
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data from API:", error);
        throw error;
    }
};

