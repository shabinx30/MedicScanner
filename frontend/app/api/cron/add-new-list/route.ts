import { after } from "next/server";

export async function GET() {
    if (!process.env.API_URL) {
        throw new Error("could not find api url");
    }

    after(() => {
        fetch(process.env.API_URL + "/cron/add-new-list", {
            method: "GET",
        }).catch((error) => console.log(error));
    });

    return new Response("Triggered", { status: 200 });
}
