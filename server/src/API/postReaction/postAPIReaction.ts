import express from "express";
import { prisma } from "../../lib/prisma";
const router = express.Router();
type PostParams = {
  postId: string;
  reactionType: string;
};
router.post(
  "/:postId",
  async (req: express.Request<PostParams>, res: express.Response) => {
    const { postId } = req.params;
    const { reactionType } = req.body;
    try {
      // забираем id пользователя из сессии
      const userId = "cmkmi9cx700001yosy0bga6rb";

      if (!userId) {
        return res
          .status(401) // код 401 не зарегистрирован
          .json({ message: "Пользователь не зарегистрирвован" });
      }

      // имещь пост под которым хотят оставить реакцию
      const post = await prisma.post.findUnique({ where: { id: postId } });

      if (!post) {
        return res
          .status(404) // код не найдено
          .json({ message: "Пост не найден" });
      }

      // Проверка, оставлял ли пользователь уже реакцию на этот пост
      const existingReaction = await prisma.postReaction.findUnique({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      });

      // Если реакция уже существует, обновляем её
      if (existingReaction) {
        // prisma !== save() для обновления. явно обновляем
        const updated = await prisma.postReaction.update({
          where: { id: existingReaction.id }, // находим реакцию по id
          data: { reactionType }, // обновляем реакцию
        });
        return res.status(200).json(updated); // отпраляем обновление на клиент
      }
      // Если реакции нет, создаем новую
      const reaction = await prisma.postReaction.create({
        data: {
          userId,
          postId: post.id, // нужно явно вернуть ответ на наличие поста в условии if (!post)
          reactionType: reactionType,
        },
      });

      //  отправляем созданную реакцию на сервер
      return res.status(200).json(reaction);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Не поставить лайк" });
    }
  },
);

export default router;
