import { ROOM_REQUESTS_FETCH_SUCCESS } from "../types/roomRequestStatusTypes";
import { AppDispatch } from "../store/store";
import axios from "axios";

// ??????
export const fetchgAll = () => {};

export const fetchUserRequestsStatus = () => async (dispatch: AppDispatch) => {
  try {
    //  запрос к API, чтобы получить все запросы (и входящие, и исходящие) для текущего пользователя
    const { data } = await axios.get(`/api/roomRequest`);
    dispatch({ type: ROOM_REQUESTS_FETCH_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
  }
};
