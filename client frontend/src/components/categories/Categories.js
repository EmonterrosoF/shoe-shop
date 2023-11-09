import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listCategory } from "../../Redux/Actions/CategoryActions";

import { Link } from "react-router-dom";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const Categories = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listCategory());
  }, [dispatch]);

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;
  return (
    <div className="container">
      <h2>Categorias</h2>
      <div className="section">
        <div className="row">
          {loading ? (
            <div className="mb-5">
              <Loading />
            </div>
          ) : error ? (
            <Message variant="alert-danger">{error}</Message>
          ) : categories.length < 1 ? (
            <h4>Sin Categorias</h4>
          ) : (
            categories.map((category) => (
              <div key={category._id} className="col-md-2 col-sm-2 ">
                <Link
                  className="card  hover-overlay"
                  to={`/category/${category._id}`}
                >
                  <div className="card-body">
                    <img
                      className="bg-image card-img-top img-fluid"
                      style={{ objectFit: "cover", maxHeight: "80px" }}
                      src={category.image}
                      alt={category.name}
                    />
                    <p>
                      <span className="text-success">Categoria: </span>{" "}
                      {category.name}
                    </p>
                    <p>
                      <span className="text-success">Descripcion: </span>{" "}
                      {category.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
