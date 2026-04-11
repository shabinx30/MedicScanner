import { IMedicineInfo } from "@/types/medicine.type";

export const submitImages = async (images: string[]) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/ocr/search-medicine`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ images }),
            },
        );

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.log("error while submitting images", error);
    }
};

export const findMedicine = async (medicineInfo: IMedicineInfo) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search-medicine`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(medicineInfo),
        });

        if(!response.ok) {
            throw new Error(`HTTP error ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.log("error while sending medicine info", error);
    }
};
