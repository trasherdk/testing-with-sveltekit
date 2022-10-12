import { PrismaClient } from '@prisma/client'
import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv'

dotenv.config()

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env

export const connectMysql = async () => {
  const pool = mysql.createPool({ host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASS, database: DB_NAME })
  let connection
  try {
    connection = await pool.getConnection()
    return connection
  } catch (error) {
    console.log('pool.getConnection() failed', error)
    return null
  }
}

export const connectPrisma = async () => {
  let connection
  const config = {
    errorFormat: 'minimal',
    log: [
      {
        emit: 'stdout',
        level: 'query',
      }
    ]
  }

  try {
    connection = new PrismaClient(config)
    /*
      .then(conn => conn)
      .catch(error => {
        console.log('PrismaClient() connection', error)
      })
    */
    // console.log('connectPrisma() connection', connection)
  } catch (error) {
    console.log('connectPrisma() failed', error)
    // process.exit(1)
  }
  return connection
}

export const db = {
  prisma: connectPrisma(),
  mysql: connectMysql()
}

export const truncate = async (table) => {
  //const pool = mysql.createPool({ host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASS, database: DB_NAME })
  const mysql = await db.mysql
  try {
    await mysql.query(`START TRANSACTION;`)

    await mysql.query(`SET FOREIGN_KEY_CHECKS = 0;`)

    await mysql.query(`TRUNCATE TABLE ${table};`)

    await mysql.query(`SET FOREIGN_KEY_CHECKS = 1;`)

    await mysql.commit()
    await mysql.release()

  } catch (error) {
    console.log('Truncate transaction %s failed', table, error)
    await mysql.query('ROLLBACK')
    await mysql.release()
  }
}

export default { db, truncate }
