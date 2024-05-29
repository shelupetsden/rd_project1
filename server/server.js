import fastify from "fastify";

import {PrismaClient} from "@prisma/client";
import dotenv from "dotenv";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";

import winston from 'winston';


dotenv.config();

const app = fastify();
const CURRENT_USER_ID = 4;
app.register(cookie, {secret: process.env.COOKIE_SECRET})
app.register(sensible)

app.addHook("onRequest", (request, response, done) => {
    if (request.cookies.userId !== CURRENT_USER_ID) {
        request.cookies.userId = CURRENT_USER_ID;
        response.clearCookie("userId");
        response.setCookie("userId", CURRENT_USER_ID);
    }

    done();
})

app.register(cors, {
    origin: process.env.CLIENT_URL, //true
    credentials: true
})

const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn'],
    }
);

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

//---------CREATE--------
app.post("/comments", async (req, res) => {
    const body = req.body;
    const newComment = body.newComment;
    logger.info("Create a new comment", newComment);
    await commitToDb(prisma.comment.create(
        {
            data: {
                userId: req.cookies.userId,
                textMessage: newComment.textMessage,
                parentId: newComment.parentId,
                createAt: new Date(),
                isEdit: false,
                updateAt: null

            }
        }));

    return getAllCommentsWithUser();
})

//---------DELETE--------
app.delete("/comments/:id", async (req, res) => {
    const {id} = req.params;
    logger.info(`Comment delete: ${id}`);
    await commitToDb(prisma.comment.delete({
        where: {id: Number(id)}
    }), id);

    return getAllCommentsWithUser();
})

//-----------------

async function getComments(parentId = null) {
    const comments = await commitToDb(prisma.comment.findMany({
        where: {parentId},
        orderBy: {createAt: 'desc'},
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
    const rootComments = await commitToDb(getComments(null), id);
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
    const updateComment = req.body;

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


app.get("/users/:id", async (req, res) => {
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