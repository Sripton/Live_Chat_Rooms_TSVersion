import {
  RoomRequestActions,
  RoomRequestsState,
  RoomRequestDTO,
} from "../types/roomRequestStatusTypes";

import {
  ROOM_REQUESTS_FETCH_SUCCESS,
  ROOM_REQUEST_UPDATE_START,
  ROOM_REQUESTS_FETCH_ERROR,
  ROOM_REQUESTS_CLEAR,
  ROOM_REQUEST_UPDATE_SUCCESS,
  ROOM_REQUEST_UPDATE_ERROR,
} from "../types/roomRequestStatusTypes";

const countPending = (items: RoomRequestDTO[]) =>
  items.reduce((accum, room) => accum + (room.status === "PENDING" ? 1 : 0), 0);

const initialState: RoomRequestsState = {
  incoming: [], // входящие запросы (другие пользователи отправили)
  outgoing: [], // исходящие запросы (пользователь сам отправил)
  loading: false, // индикатор загрузки (фетчинг запросов)
  updatingIds: [], // спиннер только на одной кнопки
  updatingById: {}, //  Record<KeysType, ValuesType>. id (ключ) -> 'accepted' | 'rejected' (значение)
  error: null, //  сообщение об ошибке
  counters: {
    incomingPending: 0, // счетчик входящих запрсов
    outgoingPending: 0, // счетчик исходящих запрсов
  },
};

export default function roomRequestStatusReducer(
  state: RoomRequestsState = initialState,
  action: RoomRequestActions
): RoomRequestsState {
  switch (action.type) {
    // Успешная загрузка входящих и исходящих запросов
    case ROOM_REQUESTS_FETCH_SUCCESS: {
      const { incoming, outgoing } = action.payload;
      return {
        ...state,
        incoming,
        outgoing,
        loading: false,
        error: null,
        counters: {
          incomingPending: countPending(incoming),
          outgoingPending: countPending(outgoing),
        },
      };
    }
    default:
      return state;
  }
}
