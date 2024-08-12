import { Server } from 'http';
import app from './app';
import config from './config';
import appDataSource from './db/dataSource';
import apolloServer from './graphql';

async function bootstrap() {
    let server: Server;
    try {
        await appDataSource.initialize();
        console.log(`🛢 Database is initialized successfully`);

        server = app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    } catch (err) {
        console.error('Failed to connect to the database\n', err);
    }

    const exitHandler = async () => {
        if (server) {
            server.close(() => {
                console.log('Server closed');
            });
        }
        await apolloServer.stop();
        process.exit(1);
    };

    const unexpectedErrorHandler = (error: unknown) => {
        console.log(error);
        exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
        console.log('SIGTERM received');
        if (server) {
            server.close();
        }
    });
}

bootstrap();
