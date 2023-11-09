import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PRODUCT_CREATE_RESET } from "../../Redux/Constants/ProductConstants";
import { createProduct } from "./../../Redux/Actions/ProductActions";
import Toast from "../LoadingError/Toast";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";

import { listCategories } from "../../Redux/Actions/CategoryActions";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
const AddProductMain = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(undefined);
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("0");

  const dispatch = useDispatch();

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, product } = productCreate;

  const categoryList = useSelector((state) => state.categoryList);

  const {
    loading: loadingCategory,
    error: errorCategory,
    categories,
  } = categoryList;

  useEffect(() => {
    dispatch(listCategories());
    if (product) {
      toast.success("Producto Agregado", ToastObjects);
      dispatch({ type: PRODUCT_CREATE_RESET });
      setName("");
      setDescription("");
      setCountInStock("");
      setImage(undefined);
      setPrice("");
      setCategory("0");
    }
  }, [product, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(); // Crea un objeto FormData
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("countInStock", countInStock);
    formData.append("category", category);

    dispatch(createProduct(formData));
  };

  return (
    <>
      <Toast />
      <section className="content-main " style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/products" className="btn btn-danger text-white">
              Ir a Productos
            </Link>
            <h2 className="content-title">Agregar producto</h2>
            <div>
              <button
                disabled={loading}
                type="submit"
                className="btn btn-primary"
              >
                Guardar
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-8 col-lg-8 container">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {error && <Message variant="alert-danger">{error}</Message>}
                  {loading && <Loading />}
                  {errorCategory && (
                    <Message variant="alert-danger">{errorCategory}</Message>
                  )}
                  {loadingCategory && <Loading />}
                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      *Titulo del Producto
                    </label>
                    <input
                      type="text"
                      placeholder="Ingresa titulo"
                      className="form-control"
                      id="product_title"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="product_price" className="form-label">
                      *Precio
                    </label>
                    <input
                      type="number"
                      placeholder="Ingresa Precio"
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
                      *En Stock
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
                          Number(e.target.value) < 1
                            ? Number(1)
                            : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">*Descripcion</label>
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
                    <label className="form-label">*Imagen</label>
                    <input
                      required
                      accept="image/png,image/jpeg,image/jpg"
                      className="form-control mt-3"
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
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddProductMain;
