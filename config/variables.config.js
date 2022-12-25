require('dotenv').config();

module.exports = {
  PSQL: {
    PORT: process.env.PSQL_PORT,
    HOST: process.env.PSQL_HOST,
    USER: process.env.PSQL_USER,
    DATABASE: process.env.PSQL_DATABASE,
    PASSWORD: process.env.PSQL_PASSWORD,
  }
}