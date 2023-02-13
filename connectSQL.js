const { PSQL } = require('./config/variables.config');

const {
  HOST,
  USER,
  DATABASE,
  PASSWORD,
  PORT } = PSQL

module.exports = {
  option: {
    client: 'pg',
    connection: {
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE,
      port: PORT 
    }
  }
}
 