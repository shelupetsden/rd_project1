import fastify from "fastify";

import {PrismaClient} from "@prisma/client";
import dotenv from "dotenv";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";

dotenv.config();

const app = fastify();

app.register(cookie)
app.register(sensible)
app.register(cors, {
    origin: process.env.CLIENT_URL, //true
    credentials: true
})
const prisma = new PrismaClient();

app.get("/comments", async (req, res) => {
    return commitToDb(prisma.comment.findMany(
        {
            select: {
                id: true,
                userId: true,
                textMessage: true,
                createAt: true,
                updateAt: true,
                rateCount: true,
                isEdit: true,
                parentId: true,
                user: {
                    select: {
                        id: true,
                        userName: true,
                        base64icon: true
                    }
                }
            }
        }
    ));
})

app.get("/comments/:id", async (req, res) => {
    const {id} = req.params;
    return commitToDb(prisma.comment.findUnique({
        where: {id: Number(id)},
        select: {
            id: true,
            userId: true,
            textMessage: true,
            createAt: true,
            updateAt: true,
            rateCount: true,
            isEdit: true,
            parentId: true,
            user: {
                select: {
                    id: true,
                    userName: true,
                    base64icon: true
                }
            }
        }
    }), id);
})


app.get("/user/:id", async (req, res) => {
    const {id} = req.params;
    return commitToDb(
        prisma.user.findUnique({
            where: {id: Number(id)},
        }), id);
});

app.get("/users", async (req, res) => {
    const {id} = req.params;
    return commitToDb(
        prisma.user.findMany(), id);
});

async function commitToDb(promise, id) {
    const [error, data] = await app.to(promise);
    if (!data) {
        return app.httpErrors.notFound(`No user found with id: ${id}`)
    }
    if (error) return app.httpErrors.internalServerError(error.message);
    return data;
}

// setTimeout(() => {
//     fastify.server.close((error) => {
//         console.log('Server is closed', error);
//     });
// }, 1000);

app.listen({port: process.env.PORT || 3001})