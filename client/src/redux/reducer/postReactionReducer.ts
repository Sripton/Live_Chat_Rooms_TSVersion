import {
  SET_POST_REACTION_CREATE,
  GET_POST_REACTION_LIST,
} from "../types/postReactionsTypes";

import { ReactionState, ReactionActions } from "../types/postReactionsTypes";

// начальное состояние Redux. первое значение state, когда приложение загрузилось.
const initialState: ReactionState = {
  byPostId: {},
  entities: {},
  errorByPostId: {},
};

export default function postReactionReducer(
  state: ReactionState = initialState,
  action: ReactionActions,
): ReactionState {
  switch (action.type) {
    case SET_POST_REACTION_CREATE: {
      // const reaction = action.payload; // созданная реакция
      // state.entities[reaction.id] = reaction; // добавляем в entities {reaction.id: reaction}

      // // создаем список реакций
      // // {postId: [reactionId1,reactionId2, reactionId3 ]}
      // const list = state.byPostId[reaction.postId] ?? []; // на данном этапе создания либо пустой либо нет
      // // если по ключу postId нету такой реакции добавляем  id реакции в массив
      // if (!list.includes(reaction.id)) {
      //   state.byPostId[reaction.postId] = [...list, reaction.id];
      // }
      // return state; // возвращаем state

      const reaction = action.payload;

      const prevList = state.byPostId[reaction.postId] ?? []; // [r1,r2,r3,r4]  || []
      const nextList = prevList.includes(reaction.id)
        ? prevList
        : [...prevList, reaction.id];

      return {
        ...state,
        entities: { ...state.entities, [reaction.id]: reaction },
        byPostId: {
          ...state.byPostId,
          [reaction.postId]: nextList,
        },
      };
    }

    default:
      return state;
  }
}
