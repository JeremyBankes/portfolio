import fs from 'fs';
import path from 'path';
import { Request, Response, ServerApplication } from 'framework';

async function start() {
    const application = new ServerApplication({ port: 7100, static: 'public' });

    application.get('*', async (request: Request, response: Response) => {
        logRequest(request);
        await response.sendFile('public/index.html');
    });

    await application.start();

    console.log(`Server now listening ${application.origin}.`);
}

function logRequest(request: Request) {
    const logDirectory = 'logs';
    const logFileName = 'requests.txt';
    const address = 'x-forwarded-for' in request.headers ? request.headers['x-forwarded-for'] as string : request.address;
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }
    const line = `${address} ${request.method} ${request.path} ${JSON.stringify(request.headers)}`;
    fs.writeFileSync(path.join(logDirectory, logFileName), line, { encoding: 'utf8', flag: 'a' });
    console.log(line);
}

start();