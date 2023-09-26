import React from "react";
import { Background } from "./components/Background.js";

export function Root() {
    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Jeremy Bankes</title>

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;1,800&display=optional" rel="stylesheet" />

                <link rel="stylesheet" href="styles/lux/lux.css" />
                <link rel="stylesheet" href="styles/main.css" />

                <script src="/bootstrap.js" />
            </head>
            <body>
                <Background />
            </body>
        </html>
    );
}