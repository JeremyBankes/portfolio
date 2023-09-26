// In-house Imports
import { Root } from "@jeremy-bankes/portfolio/frontend";

// Built-in Imports
import Path from "path";

// 3rd Party Imports
import type { Express } from "express";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";

export default function (application: Express) {

    application.get("/bootstrap.js", (request, response) => {
        response.sendFile(Path.resolve("build/frontend/bootstrap.js"));
    });

    application.get("/", (request, response) => {
        const { pipe } = renderToPipeableStream(<Root />, {
            bootstrapScripts: ["/bootstrap.js"],
            onShellReady: () => {
                response.setHeader("content-type", "text/html");
                pipe(response);
            }
        });
    });

}