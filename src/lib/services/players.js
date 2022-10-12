import { db } from './db'
import { success, error } from './result'
let prisma
export default {

  async all () {
    if (!prisma) { prisma = await db.prisma }
    const result = await prisma.player.findMany({})
    return result
  },

  async create (data) {
    if (!prisma) { prisma = await db.prisma }
    const errors = this.validate(data)
    if (Object.keys(errors).length) return error(errors)

    const result = await prisma.player.create({ data })

    return success(result)
  },

  async validate (data) {
    // if (!prisma) { prisma = await db.prisma }
    const errors = {}

    if (!data.name) {
      errors['name'] = { required: true }
    }

    if (!data.position) {
      errors['position'] = { required: true }
    }

    return errors
  }
}
