import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

async function seed() {

    const comment = await prisma.comment.create({
        data: {
            userId: 1,
            textMessage: "asas",
            parentId: 5,
            createAt: new Date(),
            isEdit: false,
            updateAt: null
        }
    })

}

seed()