import React from "react";
import BaseEditor from "../BaseEditor/BaseEditor";
import { createPostSubmit, editPost } from "../../redux/actions/postActions";
import { useAppDispatch } from "../../redux/store/hooks";
import type { Post } from "../../redux/types/postTypes";

// тип для пропсов PostEditor
type PostEditorProps =
  | {
      setIsPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
      mode: "create";
      postEditor: null;
      roomId: string;
      onCancel: () => void;
    }
  | {
      setIsPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
      mode: "edit";
      postEditor: Post;
      roomId: string;
      onCancel: () => void;
    };

export default function PostEditor({
  setIsPostModalOpen,
  mode, // пропс для переключения создать/изменить пост
  postEditor, //  изменение поста
  roomId, // id текущей комнаты
  onCancel, // закрытие формы
}: PostEditorProps) {
  const dispatch = useAppDispatch();

  return (
    <BaseEditor
      initialValues={mode === "edit" ? (postEditor?.postTitle ?? "") : ""} // изменить/создать пост
      // функция создания поста
      onSubmit={async (value: string) => {
        if (mode === "create") {
          dispatch(createPostSubmit(roomId, { postTitle: value }));
        } else {
          // if (!postEditor?.id) return; // если значение null просто return
          // ?. -> добавление undefined типу
          dispatch(editPost(postEditor.id, value)); // второй аргумент строго strign
        }
        setIsPostModalOpen(false);
      }}
      onCancel={onCancel} // закрытие формы
    />
  );
}
