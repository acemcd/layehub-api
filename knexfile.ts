import * as dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: process.env.DB_CONNECTION || ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: 'src/database/migrations',
      tableName: 'migrations'
      // stub: 'src/resources/stubs/migration.stub'
    },
    seeds: {
      directory: 'src/database/seeds'
      // stub: 'src/resources/stubs/seed.stub'
    }
  },
  production: {
    client: 'better-sqlite3',
    connection: process.env.DB_CONNECTION || '',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: 'src/database/migrations',
      tableName: 'migrations'
      // stub: 'src/resources/stubs/migration.stub'
    },
    seeds: {
      directory: 'src/database/seeds'
      // stub: 'src/resources/stubs/seed.stub'
    }
  },
  test: {
    client: 'better-sqlite3',
    connection: process.env.DB_CONNECTION || '',
    migrations: {
      directory: 'src/database/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: 'src/database/seeds'
    }
  }
};
