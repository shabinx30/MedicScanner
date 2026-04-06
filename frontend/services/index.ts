export const submitImages = async (images: string[]) => {
    try {
        const response = await fetch("http://localhost:5000", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ images }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.log("error while submitting images", error);
    }
};
