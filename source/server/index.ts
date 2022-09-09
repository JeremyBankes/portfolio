import { ServerApplication } from 'framework';

async function start() {
    const application = new ServerApplication({ port: 80, static: 'public' });

    application.get('*', async (request, response) => {
        await response.sendFile('public/index.html');
    });

    await application.start();

    console.log(`Server now listening ${application.origin}.`);
}

start();