import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { expressMiddleware } from '@apollo/server/express4';
import apolloServer from './graphql';

dotenv.config();

const app: Application = express();

const corsOptions = {
    origin: true, // allow all origins
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apollo Server setup
(async () => {
    try {
        await apolloServer.start();
        app.use(
            '/graphql',
            expressMiddleware(apolloServer, {
                context: async ({ req, res }) => {
                    return { req, res };
                },
            }),
        );
    } catch (err) {
        console.error('Error starting Apollo Server:', err);
    }
})();

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send('Something broke!');
});

export default app;
