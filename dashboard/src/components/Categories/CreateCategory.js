import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Toast from "../LoadingError/Toast";

import {
  CATEGORY_CREATE_RESET,
  CATEGORY_UPDATE_RESET,
} from "../../Redux/Constants/CategoryConstants";
import {
  createCategory,
  editCategory,
  updateCategory,
} from "./../../Redux/Actions/CategoryActions";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const CreateCategory = ({ categoryId }) => {
  const [isUpdate, setIsUpdate] = useState(false);

  const [name, setName] = useState("");
  const [image, setImage] = useState(undefined);
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  const categoryCreate = useSelector((state) => state.categoryCreate);
  const { loading, error, category } = categoryCreate;

  const categoryEdit = useSelector((state) => state.categoryEdit);
  const { error: errorEdit, category: categoryForEdit } = categoryEdit;

  const categoryUpdate = useSelector((state) => state.categoryUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = categoryUpdate;

  useEffect(() => {
    setIsUpdate(false);
    if (categoryId) {
      setIsUpdate(true);
    }

    if (successUpdate) {
      dispatch({ type: CATEGORY_UPDATE_RESET });
      toast.success("Categoria Actualizada", ToastObjects);
    } else {
      if (!categoryForEdit?.name || categoryForEdit._id !== categoryId) {
        dispatch(editCategory(categoryId));
      } else {
        setName(categoryForEdit.name);
        setDescription(categoryForEdit.description);
      }
    }

    if (category) {
      toast.success("Categoria Agregada", ToastObjects);
      dispatch({ type: CATEGORY_CREATE_RESET });
      setName("");
      setDescription("");
      setImage(undefined);
    }
  }, [category, dispatch, categoryForEdit, categoryId, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(); // Crea un objeto FormData
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);

    if (isUpdate && !errorEdit) {
      dispatch(
        updateCategory({
          _id: categoryId,
          formData,
        })
      );
      return;
    }
    dispatch(createCategory(formData));
  };

  return (
    <div className="col-md-12 col-lg-4">
      <Toast />
      <form onSubmit={submitHandler}>
        {error && <Message variant="alert-danger">{error}</Message>}
        {loading && <Loading />}
        {errorUpdate && <Message variant="alert-danger">{errorUpdate}</Message>}
        {loadingUpdate && <Loading />}

        <div className="mb-4">
          <label htmlFor="product_name" className="form-label">
            *Nombre
          </label>
          <input
            type="text"
            required
            placeholder="Escribir acá"
            className="form-control py-3"
            id="product_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">*Imagenen</label>
          <input
            required={!isUpdate}
            accept="image/png,image/jpeg,image/jpg"
            className="form-control"
            type="file"
            value={undefined}
            onChange={(e) => {
              const file = e.target.files[0]; // Selecciona el primer archivo en caso de que se permita la selección de múltiples archivos
              const maxSize = 5 * 1024 * 1024; // 5MB en bytes
              const typeAccept = [
                "image/png",
                "image/jpeg",
                "image/jpg",
              ].includes(file?.type);

              if (file && file.size <= maxSize && typeAccept) {
                setImage(file);
                return;
              }
              setImage(undefined);
            }}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">*Descripción</label>
          <textarea
            required
            placeholder="Escribir acá"
            className="form-control"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="d-grid">
          <button
            className="btn btn-primary py-3"
            disabled={loadingUpdate || loading}
          >
            {isUpdate && !errorEdit
              ? "Actualizar Categoria"
              : "Crear Categoria"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
