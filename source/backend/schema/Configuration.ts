import { Schema as LucaniaSchema } from "@lucania/schema"

export namespace Configuration {

    export const Schema = LucaniaSchema.build({
        production: { type: "boolean", required: true, default: false },
        web: {
            port: { type: "number", required: true, default: 80 }
        }
    });

}