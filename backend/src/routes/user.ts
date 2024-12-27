import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, decode, verify, jwt } from 'hono/jwt'
import { signinInput, signupInput } from "@aditya-test/blog-common";


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    }
}>();


userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const { success } = signupInput.safeParse(body)
    if (!success){
        c.status(411)
        c.json({'error': 'Something went wrong'})
    }
    try {
        const user = await prisma.user.create({
            data: {
                "email": body.email,
                "password": body.password,
                "name": body.name
            }
        })
        const jwt = await sign({
            "id": user.id,
        }, c.env.JWT_SECRET)

        return c.json({ token: jwt }, 200)
    } catch (e) {
        return c.text("Invalid")
    }

})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const { success } = signinInput.safeParse(body)
    if (!success){
        c.status(411)
        c.json({'error': 'Something went wrong'})
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                "email": body.email,
                "password": body.password
            }
        })

        if (!user) {
            c.status(403)
            return c.json({ error: "Something went wrong" })
        }

        const jwt = await sign({
            "id": user.id
        }, c.env.JWT_SECRET)
        return c.json({ token: jwt })
    } catch (e) {
        return c.text("Something went wrong")
    }
})
