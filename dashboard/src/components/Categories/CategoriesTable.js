import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../../Redux/Actions/CategoryActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import { deleteCategory } from "../../Redux/Actions/CategoryActions";

const CategoriesTable = () => {
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  let { loading, error, categories } = categoryList;

  const categoryDelete = useSelector((state) => state.categoryDelete);
  const { error: errorDelete, success: successDelete } = categoryDelete;

  const categoryCreate = useSelector((state) => state.categoryCreate);
  const { success: successCreate } = categoryCreate;

  const categoryUpdate = useSelector((state) => state.categoryUpdate);
  const { success: successUpdate } = categoryUpdate;

  categories = categories.filter((category) => category._id !== "0");

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch, successDelete, successCreate, successUpdate]);

  const deletehandler = (id) => {
    if (window.confirm("¿Estas seguro?")) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="col-md-12 col-lg-8">
      <table className="table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th className="text-end">Acción</th>
          </tr>
        </thead>
        {/* Table Data */}
        <tbody>
          <div className="center">
            {errorDelete && (
              <Message variant="alert-danger">{errorDelete}</Message>
            )}
            {error && <Message variant="alert-danger">{error}</Message>}
            {loading && <Loading />}
          </div>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>
                <img
                  style={{ width: "70px", height: "70px", objectFit: "cover" }}
                  src={category.image}
                  alt={category.name}
                />
              </td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td className="text-end">
                <div className="dropdown">
                  <Link
                    to="#"
                    data-bs-toggle="dropdown"
                    className="btn btn-light"
                  >
                    <i className="fas fa-ellipsis-h"></i>
                  </Link>
                  <div className="dropdown-menu">
                    <Link
                      className="dropdown-item"
                      to={`/category/${category._id}`}
                    >
                      Editar Categoria
                    </Link>
                    <Link
                      onClick={() => deletehandler(category._id)}
                      className="dropdown-item text-danger"
                      to="#"
                    >
                      Eliminar Categoria
                    </Link>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;
