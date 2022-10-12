import { db, truncate } from '$lib/services/db'
import players from '$lib/services/players'
import { expect } from 'vitest'
import { test } from 'vitest'
import { describe } from 'vitest'


describe('Players', () => {
  console.log('*****[ BEGIN TEST ]*****')

  beforeAll(async (msg = 'Global beforeAll()') => {
    // await db.$executeRaw`truncate table 'Player'`
    //await db.$queryRaw`truncate table Player`
    // await db.player.deleteMany({ where: {} })
    // console.log(msg)
    await truncate('player')
  })

  describe('Create and Select', () => {
    test('Select on Empty', async () => {
      const mysql = await db.mysql
      const [rows] = await mysql.query('select * from player;')
      // console.log('mysql[rows]', rows)
      //expect(fields).toHaveLength(3)
      expect(rows).toHaveLength(0)
    })

    // console.log('Prisma:', db.prisma)
    test('Create One', async () => {
      let result = await players.create({
        name: 'Wayne Gretzky',
        position: 'Center'
      })
      expect(result.success).toBeTruthy()
      // console.log('Create #1', result)
    })

    test('Select all', async () => {

      let result = await players.create({
        name: 'Wayne Gretzky',
        position: 'Center'
      })

      result = await players.all()

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Wayne Gretzky')
      expect(result[0].position).toBe('Center')
    })
  })

  describe('create', async () => {
    test('without errors', async () => {
      const result = await players.create({
        name: 'Wayne Gretzky',
        position: 'Center'
      })

      expect(result.success).toBeTruthy()
      expect(result.data.name).toBe('Wayne Gretzky')
      expect(result.data.position).toBe('Center')
    })

    test('without name', async () => {
      const result = await players.create({
        position: 'Center'
      })

      // console.log('without name', result)

      expect(result.success).toBeFalsy()
      expect(result.errors.name).toContain({ required: true })
    })

    test('without position', async () => {
      const result = await players.create({
        name: 'Gretzky'
      })

      // console.log('without position', result)

      expect(result.success).toBeFalsy()
      expect(result.errors.position).toContain({ required: true })
    })
  })
})
