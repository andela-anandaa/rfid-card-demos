const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db.sqlite')

const schema = `
  CREATE TABLE IF NOT EXISTS users(
    rfid TEXT PRIMARY KEY,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS roll(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id TEXT,
    time INTEGER
  );
`

const setup = () => {
  db.serialize(() => {
    console.info(`Setting up the database`)
    db.run(schema)
  })
  db.close()
}

const addUser = (rfid, name) => {
  db.run(`INSERT INTO users(rfid, name) VALUES ('${rfid}', '${name}')`, (err) => {
    if (err) {
      let msg = err.message
      if (/UNIQUE/.test(msg)) msg = `User already registered`
      return console.error(msg)
    } 
    console.log(`User added`)
  })
  db.close()
}

const getUsers = (rfid) => {
  const p = new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users ${rfid ? `WHERE rfid = '${rfid}'` : ''}`
    db.all(sql, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
  return p
}

module.exports = {
  db,
  setup,
  addUser,
  getUsers,
}
