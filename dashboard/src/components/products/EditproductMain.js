import React, { useState, useEffect } from "react";
import Toast from "./../LoadingError/Toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  editProduct,
  updateProduct,
} from "./../../Redux/Actions/ProductActions";
import { PRODUCT_UPDATE_RESET } from "../../Redux/Constants/ProductConstants";
import { toast } from "react-toastify";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";

import { listCategories } from "../../Redux/Actions/CategoryActions";

import { useHistory } from "react-router-dom";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const EditProductMain = (props) => {
  const { productId } = props;

  let history = useHistory();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(undefined);
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("0");

  const categoryList = useSelector((state) => state.categoryList);

  let {
    // loading: loadingCategory,
    error: errorCategory,
    categories,
  } = categoryList;

  const dispatch = useDispatch();

  const productEdit = useSelector((state) => state.productEdit);
  const { loading, error, product } = productEdit;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    dispatch(listCategories());
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      toast.success("Producto Actualizado", ToastObjects);
      const time = async () => {
        await new Promise((resolve) => setTimeout(resolve, 3500));
        history.push("/products");
      };
      time();
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(editProduct(productId));
      } else {
        setName(product.name);
        setDescription(product.description);
        setCountInStock(product.countInStock);
        setPrice(product.price);
        setCategory(product?.category || "0");
      }
    }
  }, [product, dispatch, productId, successUpdate, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(); // Crea un objeto FormData
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("countInStock", countInStock);
    formData.append("category", category);
    dispatch(
      updateProduct({
        _id: productId,
        formData,
      })
    );
  };

  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/products" className="btn btn-danger text-white">
              Ir a Productos
            </Link>
            <h2 className="content-title">Actualizar Producto</h2>
            <div>
              <button
                disabled={loadingUpdate}
                type="submit"
                className="btn btn-primary"
              >
                Actualizar
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-8 col-lg-8 container">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {errorUpdate && (
                    <Message variant="alert-danger">{errorUpdate}</Message>
                  )}
                  {errorCategory && (
                    <Message variant="alert-danger">{errorCategory}</Message>
                  )}
                  {/* {loadingCategory && <Loading />} */}
                  {loadingUpdate && <Loading />}
                  {loading ? (
                    <Loading />
                  ) : error ? (
                    <Message variant="alert-danger">{error}</Message>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label htmlFor="product_title" className="form-label">
                          Titulo del Producto
                        </label>
                        <input
                          type="text"
                          placeholder="Ingesa el Titulo"
                          className="form-control"
                          id="product_title"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="product_price" className="form-label">
                          Precio
                        </label>
                        <input
                          type="number"
                          placeholder="Ingresa el Precio"
                          className="form-control"
                          id="product_price"
                          required
                          value={price}
                          onChange={(e) =>
                            setPrice(
                              Number(e.target.value) <= 0
                                ? Number(0.99)
                                : Number(e.target.value)
                            )
                          }
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="product_price" className="form-label">
                          En Stock
                        </label>
                        <input
                          type="number"
                          placeholder="Ingresa Stock"
                          className="form-control"
                          id="product_price"
                          required
                          value={countInStock}
                          onChange={(e) =>
                            setCountInStock(
                              Number(e.target.value) < 0
                                ? Number(0)
                                : Number(e.target.value)
                            )
                          }
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Descripcion</label>
                        <textarea
                          placeholder="Ingresa la descripcion"
                          className="form-control"
                          rows="7"
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="product_title" className="form-label">
                          *Categoria
                        </label>
                        <select
                          required
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="form-select"
                        >
                          {categories.map((category) => (
                            <option
                              disabled={category.disabled}
                              // selected={category.selected}
                              key={category._id}
                              value={category._id}
                            >
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Imagen</label>
                        <input
                          className="form-control"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          multiple={false}
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditProductMain;
