
const cyExec = (command) => {
  return new Promise((resolve, rej) => {
    cy.exec(command).then(response => { resolve(response)})
  })
}

const cyRequest = ({ url, method = 'GET', its = 'body' }) => {
  return new Promise((resolve, rej) => {
    cy.request(method, url).its(its).then(result => { resolve(result) })
  })
}

module.exports = {
  cyExec,
  cyRequest
}
