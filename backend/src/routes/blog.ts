import { PrismaClient } from "@prisma/client/edge";
import { Hono } from "hono";
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from "hono/jwt";


export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>()

blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header('authorization') || "";
    if(!authHeader.startsWith('Bearer')){
        return c.json("Authentication failed")
    }
    const token = authHeader.split(' ')[1]
    const user = await verify(token, c.env.JWT_SECRET)
    
    if (user){        
        c.set('userId', String(user.id))
        await next();
    }
    else{
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
})

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const authorId = c.get("userId")
    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            published: body.published,
            authorId: authorId
        }
    })

    return c.json({
        id: blog.id
    })
})

blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const blog = await prisma.post.update({
        where:{
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
        }
    })
    return c.text("Update blog")
})
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blogs = await prisma.post.findMany({})
    return c.json({'blogs': blogs})
})

blogRouter.get('/', async (c) => {
    const body = await c.req.json()
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blog = await prisma.post.findFirst({
        where: {
            id: body.id
        }
    })
    return c.json({'blog': blog})
})