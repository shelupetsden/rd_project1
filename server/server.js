import fastify from "fastify";

import {PrismaClient} from "@prisma/client";
import dotenv from "dotenv";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";

import winston from 'winston';


dotenv.config();

const app = fastify();

app.register(cookie)
app.register(sensible)
app.register(cors, {
    // origin: process.env.CLIENT_URL,
    origin: true,
    credentials: true
})
const prisma = new PrismaClient();

app.get("/comments", async (req, res) => {
    return getAllCommentsWithUser();
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
            children: true,
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


app.delete("/comments/:id", async (req, res) => {
    const {id} = req.params;
    logger.info(`Comment delete: ${id}`);
    await commitToDb(prisma.comment.delete({
        where: {id: Number(id)}
    }), id);

    return getAllCommentsWithUser(id);
})

async function getComments(parentId = null) {
    const comments = await commitToDb(prisma.comment.findMany({
        where: { parentId },
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
    }));

    return await Promise.all(comments.map(async (comment) => {
        comment.children = await getComments(comment.id);
        return comment;
    }));
}

async function getAllCommentsWithUser(id) {
    const rootComments = await commitToDb(getComments(id));
    logger.info(rootComments);
    if (Array.isArray(rootComments)) {
        rootComments.forEach((comment) => {
            if (Array.isArray(comment.children)) {
                // Manipulate (display, handle, etc.) nested children comments here if needed
            }
        });
    }
    return rootComments;
}


app.put("/comments/:id", async (req, res) => {
    const {id} = req.params;
    const updateComment = req.body; // Assuming the update data is sent in the request body
    // logger.info(`Comment updated: ${JSON.stringify(updateComment)}`);
    logger.info(`Comment updated: ${updateComment.textMessage}`);

    await commitToDb(prisma.comment.update({
        where: {id: Number(id)},
        data: {
            userId: updateComment.userId,
            textMessage: updateComment.textMessage,
            updateAt: new Date(),
            rateCount: updateComment.rateCount,
            isEdit: true
        }
    }), id);

    return getAllCommentsWithUser(id);
});


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

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'combined.log'})
    ],
});


app.listen({port: process.env.PORT || 3001})