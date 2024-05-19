import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

async function seed() {
    const comment1 = await prisma.comment.create({
        data: {
            userId: 1,
            textMessage: "Test prisma; Nested comment for comment 1",
            parentId: 1
        }
    })

}

seed()