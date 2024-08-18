import { DataSource } from 'typeorm';
import config from '../config';

const appDataSource = new DataSource({
    type: 'postgres',
    url: config.database_url,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: ['src/db/entities/*.ts'],
    migrations: ['src/db/migrations/*.ts'],
    subscribers: ['src/db/subscribers/*.ts'],
    logging: ['error', 'warn'],
    logger: 'advanced-console',
    // migrationsRun: true, // run migration automatically when the app starts
});

export default appDataSource;
