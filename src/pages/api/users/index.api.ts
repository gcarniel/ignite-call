import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { username, fullname } = req.body

  const usernameExists = await prisma.user.findUnique({
    where: { username },
  })

  if (usernameExists) {
    return res.status(400).json({
      message: 'username already exists',
    })
  }

  const user = await prisma.user.create({
    data: {
      fullname: fullname,
      username: username,
    },
  })

  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  })

  return res.status(201).json(user)
}
