// https://blog.risingstack.com/your-first-node-js-http-server/
// 5432

require('app-module-path').addPath(`${__dirname}`);
const express = require('express')
databaseMigrator = require('database/migrator')
const app = express()
const port = 3000

app.use((request, response, next) => {
    console.log('-----------------------------------------')
    console.log(request.method + ' ' + request.url)
    console.log('-----------------------------------------')
    console.log({
        request: request.method + ' ' + request.url,
        body: request.body,
        headers: request.headers,
    })
    console.log('-----------------------------------------')
    next()
})

app.use((request, response, next) => {
    request.data = Math.random()
    next()
})

app.get('/', (request, response) => {
    response.json({
        data: request.data
    })
})

app.get('/throwError', (request, response) => {
    throw new Error("Some error")
})

app.use((err, request, response, next) => {
    console.error(err.stack);
    response.status(500).send(err.stack)
})

app.listen(port, (err) => {
    if (err) {
        return console.log('An error occurred during startup.', err)
    }

    console.log('=====================================')
    console.log(`The server is listening on port ${port}.`)
    console.log('=====================================')

    databaseMigrator.update()
})