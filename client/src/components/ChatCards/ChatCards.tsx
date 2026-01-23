import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Tooltip,
  IconButton,
  Avatar,
  Stack,
  Grow,
  Zoom,
  Slide,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { motion, AnimatePresence } from "framer-motion";

// Иконки
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";

// Анимация
// containerVariants - для контейнера, который содержит список постов. Он задает анимацию появления всего контейнера и его детей (детей - это отдельные посты).
const containerVariants = {
  hidden: { opacity: 0 }, // начальное состояние (невидимо, opacity: 0)
  visible: {
    // конечное состояние (видимо, opacity: 1)
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0.1 },
  },
};

// Colors - в стиле ChatRooms
const COLORS = {
  mainColor: "#1d102f",
  mainColorLight: "#2a183d",
  cardBg: "#231433",
  accentColor: "#b794f4",
  accentSoft: "rgba(183,148,244,0.15)",
  textMuted: "#9ca3af",
  gradient: "linear-gradient(135deg, #2a183d 0%, #1d102f 100%)",
  dangerColor: "#ef4444",
};

// react hooks
import { useNavigate, useParams } from "react-router-dom";

// redux hoooks
import { useAppSelector, useAppDispatch } from "../../redux/store/hooks";

// redux thunk
// функция передачи одной комнаты по id
import { getRoomById } from "../../redux/actions/roomActions";

// функция передачи всех постов по id комнаты
import { fetchPosts, deletepost } from "../../redux/actions/postActions";

// redux types
import { CLEAR_ROOM_POSTS } from "../../redux/types/postTypes";
import type { Post } from "../../redux/types/postTypes";

import PostEditor from "../PostEditor/PostEditor";

export default function ChatCards() {
  const { id } = useParams(); // id комнаты из useParams
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  //состояние для открытия форма для создания поста
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);

  // состояние для создания/изменения поста
  const [postEditor, setPostEditor] = useState<Post | null>(null);

  // ------------------ Store ------------------
  // Забираем из store  комнату текущую комнату
  const { currentRoom } = useAppSelector((store) => store.room);

  // Забираем из store данные user
  const { userId } = useAppSelector((store) => store.user);

  // Забираем все поты из store
  const { posts } = useAppSelector((store) => store.post);

  // загружаем комнату при рендере
  useEffect(() => {
    if (!id) return;
    dispatch({ type: CLEAR_ROOM_POSTS }); // очищаем посты при смене комнаты
    dispatch(getRoomById(id)); // загрудаем комнату по id
    dispatch(fetchPosts(String(id))); // загружаем все посты данной клмнаты
  }, [id, dispatch]);

  const handleOpenPostModal = (post?: Post | null) => {
    // если пользоаватель не зарегистрирвоан
    if (!userId) {
      navigate("/signin");
      return;
    }

    setPostEditor(post || null);
    //котрываем форму для создания поста
    setIsPostModalOpen(true);
  };

  // Анимация появления элементов
  const styleAnimation = (index: number) => ({
    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
    "@keyframes fadeInUp": {
      "0%": {
        opacity: 0,
        transform: "translateY(10px)",
      },
      "100%": {
        opacity: 1,
        transform: "translateY(0)",
      },
    },
  });

  console.log("postEditor", postEditor);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: { xs: "auto", md: "100vh" },
        overflowY: { xs: "auto", sm: "auto", md: "auto" },
        overflowX: "hidden",
        bgcolor: COLORS.mainColor,
        color: "#e5e7eb",
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          mt: { xs: 1, sm: 2 },
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Хедер комнаты */}
        <Slide in={true} direction="down" timeout={300}>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              mb: 4,
              p: isMobile ? 2 : 2.5,
              background: "rgba(35, 20, 51, 0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              border: "1px solid rgba(183, 148, 244, 0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "rgba(183, 148, 244, 0.3)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  background: "rgba(183,148,244,0.1)",
                  border: `2px solid rgba(183,148,244,0.3)`,
                }}
              >
                {currentRoom?.isPrivate ? "🔒" : "🌐"}
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontFamily:
                      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    background: "linear-gradient(45deg, #e5e7eb, #b794f4)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {currentRoom?.nameRoom}
                </Typography>

                {currentRoom?.owner?.username && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: COLORS.textMuted,
                      fontSize: "0.875rem",
                      fontFamily: "'Inter', sans-serif",
                      mt: 0.25,
                    }}
                  >
                    Владелец: {currentRoom.owner?.username}
                  </Typography>
                )}
              </Box>
            </Box>

            <Button
              variant="contained"
              disabled={isPostModalOpen}
              onClick={() => handleOpenPostModal(null)} // явно передаем null
              startIcon={<AddIcon />}
              sx={{
                borderRadius: "14px",
                textTransform: "none",
                px: 3,
                py: 1,
                background: "linear-gradient(135deg, #b794f4 0%, #8b5cf6 100%)",
                color: "#1f2933",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
                },
                "&.Mui-disabled": {
                  background: "rgba(183,148,244,0.3)",
                  color: "rgba(156, 163, 175, 0.5)",
                },
              }}
            >
              Добавить пост
            </Button>
          </Paper>
        </Slide>

        {isPostModalOpen && (
          <Slide in={isPostModalOpen} direction="up" timeout={300}>
            <Box sx={{ mb: 3 }}>
              <PostEditor
                setIsPostModalOpen={setIsPostModalOpen}
                mode={postEditor ? "edit" : "create"} // пропс для переклдчения создать/изменить пост
                postEditor={postEditor} //  изменение поста
                roomId={String(id)} // id текущей комнаты
                onCancel={() => setIsPostModalOpen(false)} // закрытие формы
              />
            </Box>
          </Slide>
        )}
        <Divider
          sx={{
            border: "1px solid rgba(255,255,255,0.05)",
            mb: 3,
            opacity: 0.3,
          }}
        />

        {/* Список постов */}
        {Array.isArray(posts) && posts.length > 0 ? (
          <Box
            component={motion.div}
            variants={containerVariants} // применяем варианты контейнера
            initial="hidden" // начальное состояние
            animate="visible" // конечное состояние
          >
            <AnimatePresence>
              <Stack spacing={2}>
                {posts.map((post, index) => {
                  return (
                    <Grow in={true} timeout={index * 100} key={post.id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: isMobile ? 2 : 2.5,
                          borderRadius: "16px",
                          background: "rgba(35, 20, 51, 0.7)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(183, 148, 244, 0.1)",
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "3px",
                            background:
                              "linear-gradient(180deg, #b794f4, transparent)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                          },
                          "&:hover": {
                            transform: "translateX(4px)",
                            background: "rgba(183,148,244,0.08)",
                            borderColor: "rgba(183,148,244,0.3)",
                            boxShadow: "0 4px 20px rgba(183,148,244,0.15)",
                            "&::before": {
                              opacity: 1,
                            },
                          },
                          ...styleAnimation(index),
                        }}
                      >
                        {/* Заголовок и автор */}
                        <Box sx={{ mb: 1.5 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              mb: 1.5,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                background: "rgba(183,148,244,0.1)",
                                border: "1px solid rgba(183,148,244,0.2)",
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: isMobile ? "0.875rem" : "0.95rem",
                                  color: "#e5e7eb",
                                  lineHeight: 1.2,
                                }}
                              >
                                {post?.user?.username || "Аноним"}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: COLORS.textMuted,
                                  fontSize: "0.75rem",
                                  fontFamily: "'Inter', sans-serif",
                                  mt: 0.25,
                                }}
                              >
                                {new Date(
                                  Date.parse(post.createdAt),
                                ).toLocaleDateString("ru-RU", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Текст поста */}
                          <Typography
                            sx={{
                              color: "#e5e7eb",
                              lineHeight: 1.6,
                              fontSize: isMobile ? "0.9rem" : "0.95rem",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {post.postTitle}
                          </Typography>
                        </Box>

                        {/* Панель действий */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                            pt: 1.5,
                            borderTop: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          {/* like */}
                          <Button
                            size="small"
                            startIcon={<ThumbUpIcon />}
                            sx={{
                              color: COLORS.textMuted,
                              minWidth: "auto",
                              px: 1.5,
                              py: 0.5,
                              fontSize: "0.8rem",
                              borderRadius: "10px",
                              textTransform: "none",
                              fontFamily: "'Inter', sans-serif",
                              background: "rgba(255,255,255,0.02)",
                              "&:hover": {
                                background: "rgba(183,148,244,0.1)",
                                color: COLORS.accentColor,
                              },
                              "& .MuiButton-startIcon": { mr: 0.5 },
                            }}
                          >
                            0
                          </Button>
                          {/* dislike */}
                          <Button
                            size="small"
                            startIcon={<ThumbDownIcon />}
                            sx={{
                              color: COLORS.textMuted,
                              minWidth: "auto",
                              px: 1.5,
                              py: 0.5,
                              fontSize: "0.8rem",
                              borderRadius: "10px",
                              textTransform: "none",
                              fontFamily: "'Inter', sans-serif",
                              background: "rgba(255,255,255,0.02)",
                              "&:hover": {
                                background: "rgba(239,68,68,0.1)",
                                color: COLORS.dangerColor,
                              },
                              "& .MuiButton-startIcon": { mr: 0.5 },
                            }}
                          >
                            0
                          </Button>

                          {/* Комментарии */}
                          <Button
                            size="small"
                            startIcon={<CommentIcon />}
                            sx={{
                              color: COLORS.textMuted,
                              minWidth: "auto",
                              px: 1.5,
                              py: 0.5,
                              fontSize: "0.8rem",
                              borderRadius: "10px",
                              textTransform: "none",
                              fontFamily: "'Inter', sans-serif",
                              background: "rgba(255,255,255,0.02)",
                              "&:hover": {
                                background: "rgba(183,148,244,0.1)",
                                color: COLORS.accentColor,
                              },
                              "& .MuiButton-startIcon": { mr: 0.5 },
                            }}
                          >
                            0
                          </Button>

                          {/* Ответить */}
                          <Button
                            size="small"
                            startIcon={<ReplyIcon />}
                            sx={{
                              color: COLORS.accentColor,
                              minWidth: "auto",
                              px: 1.5,
                              py: 0.5,
                              fontSize: "0.8rem",
                              borderRadius: "10px",
                              textTransform: "none",
                              fontFamily: "'Inter', sans-serif",
                              background: "rgba(183,148,244,0.1)",
                              "&:hover": {
                                background: "rgba(183,148,244,0.2)",
                                transform: "translateY(-1px)",
                              },
                              "& .MuiButton-startIcon": { mr: 0.5 },
                            }}
                          >
                            Ответить
                          </Button>

                          {/* Действия автора */}
                          {userId === post?.user?.id && (
                            <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
                              {/* изменние поста */}
                              <IconButton
                                size="small"
                                onClick={() => handleOpenPostModal(post)} // передаем сам пост
                                sx={{
                                  color: COLORS.accentColor,
                                  background: "rgba(183,148,244,0.1)",
                                  "&:hover": {
                                    background: "rgba(183,148,244,0.2)",
                                    transform: "scale(1.1)",
                                  },
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>

                              {/* удаление поста */}
                              <IconButton
                                size="small"
                                onClick={() => dispatch(deletepost(post.id))}
                                sx={{
                                  color: COLORS.dangerColor,
                                  background: "rgba(239,68,68,0.1)",
                                  "&:hover": {
                                    background: "rgba(239,68,68,0.2)",
                                    transform: "scale(1.1)",
                                  },
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </Paper>
                    </Grow>
                  );
                })}
              </Stack>
            </AnimatePresence>
          </Box>
        ) : (
          <Zoom in={true} timeout={500}>
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: COLORS.textMuted,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: isMobile ? "0.95rem" : "1rem",
                }}
              >
                Пока нет постов. Будьте первым!
              </Typography>
            </Box>
          </Zoom>
        )}
      </Box>
    </Box>
  );
}
