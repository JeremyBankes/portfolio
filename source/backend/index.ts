// Internal Imports
import { Configuration } from "./schema/Configuration.js";
import registerGeneralRoutes from "./routing/general.js";

// In-house Imports
import { Schema } from "@lucania/schema";
import { File } from "@lucania/toolbox/server";

// Standard Imports
import Path from "path";

// 3rd Party Imports
import express, { Express, NextFunction, Request, RequestHandler, Response } from "express";
import { PathParams } from "express-serve-static-core";
import registerMiddleware from "./routing/middleware.js";

async function start() {
    const rootDirectory = Path.resolve(".");
    const configurationData = await File.read(Path.join(rootDirectory, "configuration.json"), "utf8");
    const configuration = Schema.validate(Configuration.Schema, JSON.parse(configurationData));

    process.env.NODE_ENV = configuration.production ? "production" : "development";

    const application = setupAsyncErrorHandling(express());
    
    registerMiddleware(application);
    registerGeneralRoutes(application);

    application.use((error: Error, request: Request, response: Response, next: NextFunction) => {
        response.end(error.message);
    });

    application.listen(configuration.web.port, () => {
        console.info(`Server now listening on port ${configuration.web.port}!`);
    });
}

function setupAsyncErrorHandling(application: Express) {
    const functionNames: (keyof Express)[] = [
        "checkout", "copy", "delete", "get", "head", "lock", "merge", "mkactivity", "mkcol", "move", "m-search", "notify",
        "options", "patch", "post", "purge", "put", "report", "search", "subscribe", "trace", "unlock", "unsubscribe"
    ];
    for (const functionName of functionNames) {
        if (functionName in application) {
            const method = application[functionName];
            if (typeof method === "function") {
                application[functionName] = function (path: PathParams, ...handlers: RequestHandler[]) {
                    return method.call(this, path, ...handlers.map(handler => (request: Request, response: Response, next: NextFunction) => {
                        return Promise.resolve(handler(request, response, next)).catch(next);
                    }));
                };
            }

        }
    }
    return application;
}

start();