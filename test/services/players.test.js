import { db, truncate } from '$lib/services/db'
import players from '$lib/services/players'
//import { beforeAll } from 'vitest'
import { expect } from 'vitest'
import { test } from 'vitest'
import { describe } from 'vitest'

describe('Players', () => {
  console.log('*****[ BEGIN TEST ]*****')

  beforeAll(async () => {
    // const prisma = await db.prisma
    // await prisma.$executeRaw`truncate table 'Player'`
    // await prisma.$queryRaw`truncate table Player`
    // await prisma.player.deleteMany({ where: {} })
    await truncate('player')
  })

  describe('Create and Select', () => {
    test('Select on Empty', async () => {
      const mysql = await db.mysql
      const [rows] = await mysql.query('select * from player;')

      expect(rows).toHaveLength(0)
    })

    // console.log('Prisma:', db.prisma)
    test('Create One', async () => {
      let result = await players.create({
        name: 'Wayne Gretzky',
        position: 'Center'
      })

      // console.log('Create #1', result)

      expect(result.data.id).toBe(1)
      expect(result.success).toBeTruthy()
    })

    test('Select all', async () => {
      let result = await players.create({
        name: 'Wayne Gretzky',
        position: 'Center'
      })

      expect(result.data.id).toBe(1)
      expect(result.success).toBeTruthy()

      result = await players.all()

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Wayne Gretzky')
      expect(result[0].position).toBe('Center')
    })
  })

  describe('Create', async () => {
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
        name: 'Wayne Gretzky'
      })

      expect(result.success).toBeFalsy()
      expect(result.errors.position).toContain({ required: true })
    })
  })
})
