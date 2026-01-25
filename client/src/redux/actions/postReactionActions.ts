import {
  SET_POST_REACTION_CREATE,
  GET_POST_REACTION_LIST,
} from "../types/postReactionsTypes";
import axios from "axios";

import type { AppDispatch } from "../store/store";
import type { Reaction, ReactionType } from "../types/postReactionsTypes";

export const felts = () => {};

export const createPostReaction =
  (postId: string, reactionType: ReactionType) =>
  async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.post<Reaction>(
        `/api/post_reactions/${postId}`,
        {
          reactionType,
        },
      );

      dispatch({ type: SET_POST_REACTION_CREATE, payload: data });
    } catch (error) {
      console.log("Реакция не создалась", error);
    }
  };
