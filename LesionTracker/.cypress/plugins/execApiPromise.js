const { exec } = require('child_process')


const execApiPromise = ({ method = 'GET', url = '', data = null }) => {
  const dataParam = (data) ? ` --data '${JSON.stringify(data)}'` : ''
  const command = `curl -X ${method} "${url}"${dataParam}`
  console.log(command)
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(error)
        return reject(error)
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
      }
      // console.log(`stdout: ${stdout}`, JSON.parse(stdout))
      resolve(JSON.parse(stdout))
    })
  })
}

module.exports = execApiPromise
