'use strict'

const pgp = require('pg-promise')()

exports.createDatabase = async function createDatabase(databaseName, host, port, username, password) {
    var db = pgp(`postgresql://${username}:${password}@${host}:${port}/postgres`)
    console.log(`Checking if database '${databaseName}' exists on the postgres server at '${host}:${port}'`)
    if (await databaseExists(db, databaseName)) {
        console.log(`The database already exists. Skipping database creation.`)
    } else {
        console.log(`The database does not exist. Creating database.`)
        await create(db, databaseName)
        console.log(`The database has been created successfully.`)
    }

    process.exit()
}

async function databaseExists(db, databaseName) {
    try {
        var result = await db.one('SELECT count(1) FROM pg_catalog.pg_database WHERE lower(datname) = lower($1)', databaseName)
        return result.count != '0'
    } catch (e) {
        console.error(`An error occurred while checking if the database exists.`, e)
    }
}

async function create(db, databaseName) {
    try {
        await db.none('CREATE DATABASE $1:raw', databaseName)
    } catch (e) {
        console.error(`An error occurred while creating the database.`, e)
    }
}