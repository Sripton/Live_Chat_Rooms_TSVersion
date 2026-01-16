import express from "express";
import { prisma } from "../../lib/prisma";
const router = express.Router();

router.delete("/", async (req, res) => {
  const id = 'cmk8i0rm7000684oscefpepdt';
  try {
    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      return res.status(404).json({ error: "Комната не найдена" });
    }

    // Если найдена - удаляем
    await prisma.room.delete({ where: { id } });
    res.status(200).json({ message: "Успешно удалено" });
  } catch (error) {
    console.log(error);
  }
});

export default router;
