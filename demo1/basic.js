const readline = require('readline')

const AsciiTable = require('ascii-table')
const chalk = require('chalk')

const { addUser, getUsers } = require('./db')

const enrollUsers = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question('Tap the card to enroll: ', (rfid) => {
    if (rfid.length < 18) console.error(`Not a valid ID!`)
    else {
      const id = rfid.substr(10)
      rl.question('Name: ', (name) => {
        if (name.length < 3) return console.error(`Invalid name`)
        // store to db
        addUser(id, name)
        rl.close()
      })
    }
  })

  rl.close()
}

const listUsers = async () => {
  const users = await getUsers()
  const table = new AsciiTable('Users')
  table.setHeading('ID', 'Name')
  users.forEach(u => table.addRow(u.rfid, u.name))
  console.log(table.toString())
}

const getUser = async (rfid) => {
  const user = await getUsers(rfid)
  console.log(user)
}

const isValidID = (id) => id.length == 18

const run = (cb) => {
  // REPL
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const q = (cb) => {
    rl.question(chalk.green.bold('Andela.BASIC> '), (input) => {
      // for now
      if (isValidID(input)) {
        console.info(chalk.yellow(' ✓ valid ID'))
        // if user not found, enroll them
        // if found, run callback
      }
      else if (input.toLowerCase() == 'exit') process.exit()
      else console.log('not a valid ID')
      q(cb)
    })
  }
  q(cb)
}


module.exports = {
  enrollUsers,
  listUsers,
  getUser,
  run,
}
