import compression from "compression";
import express, { Express } from "express";

export default function (application: Express) {

    application.use(compression());
    application.use(express.static("public"));

}