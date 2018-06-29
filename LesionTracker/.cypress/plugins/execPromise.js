const { exec } = require('child_process')

const execPromise = (shellCommand) => {
  console.log(shellCommand)
  return new Promise((resolve, reject) => {
    exec(shellCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`)
          reject(error)
          return
        }
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
        resolve(stdout)
      }
    )
  })
}

module.exports = execPromise
