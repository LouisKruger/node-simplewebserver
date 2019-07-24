'use strict'

const initOptions = {/* initialization options */}
const pgp = require('pg-promise')(initOptions)
const connectionString = 'postgresql://postgres:postgres@localhost:5432/postgres'
const db = pgp(connectionString)

async function update() {
    var databaseName = 'simplewebserver'
    if (await databaseExists(databaseName)) {
        console.log(`The database '${databaseName}' already exists. Continuing.`)
    } else {
        console.log(`Database '${databaseName}' does not exist. Creating new database.`)
        createDatabase(databaseName)
    }
}

async function databaseExists(databaseName) {
    try {
        var result = await db.one('SELECT count(1) FROM pg_catalog.pg_database WHERE lower(datname) = lower($1)', databaseName)
        return result.count != '0'
    } catch (e) {
        console.error(`An error occurred while checking if the database "${databaseName}" exists.`, e)
    }
}

async function createDatabase(databaseName) {
    try {
        await db.none('CREATE DATABASE $1:raw', databaseName)
    } catch (e) {
        console.error(`An error occurred while creating the database "${databaseName}".`, e)
    }
}

exports.update = update