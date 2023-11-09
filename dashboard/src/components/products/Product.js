import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../Redux/Actions/ProductActions";

const Product = (props) => {
  const { product } = props;
  const dispatch = useDispatch();

  const deletehandler = (id) => {
    if (window.confirm("¿Estas seguro?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <>
      <div className="col-md-6 col-sm-6 col-lg-3 mb-5">
        <div className="card card-product-grid shadow-sm">
          <Link to="#" className="img-wrap">
            <img src={product.image} alt="Product" />
          </Link>
          <div className="info-wrap">
            <Link to="#" className="title text-truncate">
              <span className="text-success">Producto:</span> {product.name}
            </Link>
            <Link to="#" className="title text-truncate">
              <span className="text-success">Categoria:</span>{" "}
              {product.category?.name}
            </Link>
            <Link to="#" className="title text-truncate">
              <span className="text-success">Stock:</span>{" "}
              {product.countInStock}
            </Link>
            <div className="price mb-2">
              <span className="text-success">Precio:</span> Q{product.price}
            </div>
            <div className="row">
              <Link
                to={`/product/${product._id}/edit?cat=${product.category?._id}`}
                className="btn btn-sm btn-outline-success p-2 pb-3 col-md-6"
              >
                <i className="fas fa-pen"></i>
              </Link>
              <button
                to="#"
                onClick={() => deletehandler(product._id)}
                className="btn btn-sm btn-outline-danger p-2 pb-3 col-md-6"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
