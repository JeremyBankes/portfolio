import { Request, Response, ServerApplication } from "framework";

async function start() {
    const application = new ServerApplication({ host: "localhost", port: 7100, static: "public" });

    application.get("*", async (request: Request, response: Response) => {
        await response.sendFile("public/index.html");
    });

    await application.start();

    console.log(`Server now listening ${application.origin}.`);
}

start();