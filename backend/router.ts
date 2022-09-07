import express from 'express';
import { PrismaClient } from '@prisma/client'
import fs from 'fs';
import {createHash} from 'crypto';

const prisma = new PrismaClient();
export const router = express.Router();

type Position = {
    title: string;
    composition: string[];
    weight: number;
    image: Uint8Array;
    categoryId: number;
};

router.route('/category')
.post(async (req, res) => {
    const {name} = req.body;
    const result = await prisma.category.create({
        data: {
            name
        }
    });
    res.json(result);
})
.get(async (_, res) => {
    const result = await prisma.category.findMany({select: {id: true, name: true}});
    res.json(result);
})
.delete(async (req, res) => {
    const {id} = req.body;
    const result = await prisma.category.delete({where: {id}});
    res.json(result);
})

router.route('/position')
.post(async (req, res) => {
    const {image, title, weight, categoryId, composition}: Position = req.body;
    const hashSum = createHash('sha256');
    const imageName = hashSum.update(
        `${categoryId}:${title}:${weight}:${categoryId}`
        ).digest('hex');
    /**
     * Хранить изображение в базе - такое себе,
     * а транзакционно сохранить файл и сделать запись в базе нельзя.
     * Если не удалось записать файл - бросаем.
     * При следующей попытке файл просто перезапишется.
     */
    await fs.writeFile(`/usr/images/${imageName}`, image, (err) => {
        res.status(500);
        throw err;
    });
    const result = await prisma.position.create({data: {
        title,
        categoryId,
        image: imageName,
        weight,
        composition
    }});
    res.json(result);
    var s = '';
    s.substring
})
.delete(async (req, res) => {
    const {id} = req.body;
    const position = prisma.position.findFirst({select: {id}});
    if (position == null) {
        res.writeHead(404, 'Position does not exist');
        return;
    }
    const result = prisma.position.delete({where: {id}});
    res.json(result);
});
