import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { expressMiddleware } from '@apollo/server/express4';
import apolloServer, { CustomContext } from './graphql';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { jwtHelpers } from './helpers/jwtHelpers';
import config from './config';
import { JwtPayload, Secret } from 'jsonwebtoken';

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

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: 'Hello World!' });
});

const startServer = async () => {
    try {
        await apolloServer.start();
        app.use(
            '/graphql',
            expressMiddleware(apolloServer, {
                context: async ({ req, res }) => {
                    const accessToken = req.headers.authorization;

                    let userInfo: JwtPayload | null = null;
                    if (accessToken) {
                        userInfo = await jwtHelpers.verifyToken(
                            accessToken,
                            config.jwt.secret as Secret,
                        );
                    }

                    return { req, res, userInfo };
                },
            }),
        );

        // Global error handler
        app.use(globalErrorHandler);

        // Handle 404 errors
        app.use((req: Request, res: Response, next: NextFunction) => {
            res.status(404).json({
                message: 'API Not Found',
                error:
                    process.env.NODE_ENV === 'development'
                        ? `Cannot ${req.method} ${req.url}`
                        : undefined,
            });
        });
    } catch (error) {
        console.error('Error starting Apollo Server:', error);
    }
};

startServer();

export default app;
