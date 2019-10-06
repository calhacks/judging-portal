console.log('db index.js')

const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL
const pool = new Pool({
	ssl: true,
	connectionString: connectionString
})

module.exports = {
	query: (text, params, callback) => pool.query(text, params, callback),
	pool
}
