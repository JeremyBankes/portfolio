import { Request, Response, ServerApplication, StaticFileHandler } from "framework";

async function start() {
    const application = new ServerApplication({ host: "localhost", port: 7100 });

    const publicHandler = new StaticFileHandler("public");

    application.get("*", async (request: Request, response: Response) => {
        response.setHeader("Cache-Control", "public, max-age=86400");
        await publicHandler.handle(request, response);
    });

    application.get("*", async (request: Request, response: Response) => {
        await response.sendFile("public/index.html");
    });

    await application.start();

    console.log(`Server now listening ${application.origin}.`);
}

start();