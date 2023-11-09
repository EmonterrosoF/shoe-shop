import axios from "../../http";
import {
  CATEGORY_DETAILS_FAIL,
  CATEGORY_DETAILS_REQUEST,
  CATEGORY_DETAILS_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
} from "../Constants/CategoryConstants";

// CATEGORY LIST
export const listCategory = () => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST });
    const { data } = await axios.get(`/api/categories`);
    dispatch({ type: CATEGORY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Productos filtrado por categorias
export const listProductForCategory =
  (id, pageNumber = 1) =>
  async (dispatch) => {
    try {
      dispatch({ type: CATEGORY_DETAILS_REQUEST });
      const { data } = await axios.get(
        `/api/categories/product/${id}?pageNumber=${pageNumber}`
      );
      dispatch({ type: CATEGORY_DETAILS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: CATEGORY_DETAILS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
