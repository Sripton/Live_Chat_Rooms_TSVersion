import express from "express";
import { prisma } from "../../lib/prisma";
const router = express.Router();

// тип параметр id комнаты
type ParamsRoomId = { roomId: string };

// тип параметр id поста
type ParamsPostId = { postId: string };

// тип body PostBody
type BodyPost = { postTitle?: string };

router.post(
  `/:roomId`,
  async (
    req: express.Request<ParamsRoomId, any, BodyPost>,
    res: express.Response,
  ) => {
    const { roomId } = req.params;
    const postTitle = String(req.body?.postTitle ?? "").trim();

    // Забираем id пользовтаеля из сессии
    const userId = req.session.userId;
    if (!userId)
      return res.status(401).json({ message: "Необходима авторизация." });

    // Валидация поста
    if (!postTitle)
      return res.status(400).json({ message: "Пост не может быть пустым" });
    try {
      // Ищем объект Room по его первичному ключу (id)
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room)
        return res.status(404).json({ message: "Комната не найдена." });

      // если приватная — проверяем доступ
      if (room.isPrivate && room.ownerId !== userId) {
        const admission = await prisma.roomAdmission.findUnique({
          where: {
            userId_roomId: { userId, roomId },
          },
        });
        if (!admission)
          return res.status(403).json({ message: "Нет доступа к комнате." });
      }

      //создаем post
      const post = await prisma.post.create({
        data: {
          userId,
          roomId: room.id,
          postTitle,
        },
        include: {
          user: { select: { id: true, username: true, avatar: true } },
        },
      });

      return res.status(201).json(post);
    } catch (error: unknown) {
      console.log(error);
      return res.status(500).json({ message: "Ошибка при создании поста" });
    }
  },
);

// Маршрут для получения списка всех постов
router.get("/:roomId", async (req: express.Request, res: express.Response) => {
  const { roomId } = req.params as ParamsRoomId; // Получаем ID из параметров URL
  try {
    // const userID = req.session.userID;
    // Ищем все посты относящиеся к определенной комнате по ID
    const post = await prisma.post.findMany({
      where: { roomId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(post); // Отправляем все посты на клиент
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ошибка при передачи постов" }); // Отправляем сообщение об ошибке
  }
});

// Маршрут для изменения одного поста
router.patch(
  `/changepost/:postId`, // postId => только для параметров url
  async (req: express.Request, res: express.Response) => {
    const { postId } = req.params as ParamsPostId;
    const { postTitle } = req.body as BodyPost;

    // Валидация
    if (!postTitle || postTitle.trim() === "") {
      return res.status(400).json({ message: "Пост не может быть пустым" });
    }
    try {
      // ищем пост по id
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post) {
        return res.status(404).json({ message: "Пост не найден" });
      }

      // Обновляем пост
      const updatedPost = await prisma.post.update({
        where: { id: postId }, // где id поста
        data: { postTitle }, // сам пост
      });

      // отдаем обновленный пост на клиент
      return res.status(200).json(updatedPost);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Ошибка при изменении поста" });
    }
  },
);

// Маршрут для удаления одного поста
router.delete(
  `/deletepost/:postId`,
  async (req: express.Request, res: express.Response) => {
    const { postId } = req.params as ParamsPostId;

    try {
      // удаляем пост по его id
      const post = await prisma.post.delete({
        where: { id: postId },
      });
      if (!post) {
        // ничего не удалилось → поста не было
        return res.status(404).json({ message: "Пост не найден" });
      }

      // для подстверждения  удаления:
      return res.status(200).json({ postId });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: "Не удалось удалить пост" });
    }
  },
);

export default router;
