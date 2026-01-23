import {
  SET_CREATE_POST,
  GET_ROOM_POSTS,
  CLEAR_ROOM_POSTS,
  SET_EDIT_POST,
  DELETE_POST,
} from "../types/postTypes";

import type { PostActions, PostsState } from "../types/postTypes";

// начальное состояние Redux. первое значение state, когда приложение загрузилось.
const initialState: PostsState = {
  posts: [], // список всех постов текущей комнаты
};

export default function postReducer(
  state: PostsState = initialState,
  action: PostActions,
): PostsState {
  // возвращаемый тип
  switch (action.type) {
    case SET_CREATE_POST:
      // защита от дубликатов
      if (state.posts.some((post) => post.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        posts: [action.payload, ...state.posts], // новый пост сверху всегда
      };

    case GET_ROOM_POSTS:
      return { ...state, posts: action.payload };

    case CLEAR_ROOM_POSTS:
      return { ...state, posts: [] }; // возвращаем пустой массив

    case SET_EDIT_POST: {
      const { postId, postTitle } = action.payload;
      return {
        ...state,
        posts: state.posts.map(
          (post) =>
            post.id === postId
              ? {
                  ...post, // другие поля без изменения
                  postTitle, // заменям текст поста
                }
              : post, // иначе возвращаем  пост без изменения
        ),
      };
    }

    case DELETE_POST: {
      const { postId } = action.payload;
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== postId),
      };
    }

    default:
      return state;
  }
}
