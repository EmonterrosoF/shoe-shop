import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Rating from "../components/homeComponents/Rating";
import Pagination from "../components/homeComponents/pagination";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/LoadingError/Loading";
import Message from "../components/LoadingError/Error";
import { listProductForCategory } from "../Redux/Actions/CategoryActions";
import Header from "../components/Header";
import CalltoActionSection from "../components/homeComponents/CalltoActionSection";
import ContactInfo from "../components/homeComponents/ContactInfo";
import Footer from "../components/Footer";

const ProductForCategory = ({ match }) => {
  const id = match.params.id;
  const pageNumber = match.params.pagenumber;

  const dispatch = useDispatch();

  const productForCategory = useSelector(
    (state) => state.listProductForCategory
  );
  const { loading, error, products, page, pages } = productForCategory;

  useEffect(() => {
    dispatch(listProductForCategory(id, pageNumber));
  }, [dispatch, id, pageNumber]);
  return (
    <>
      <Header />

      <div className="container">
        <h2>
          Productos por Categoria:{" "}
          <span className="text-success">{products[0]?.category?.name}</span>
        </h2>
        <div className="section">
          <div className="row">
            <div className="col-lg-12 col-md-12 article">
              <div className="shopcontainer row">
                {loading ? (
                  <div className="mb-5">
                    <Loading />
                  </div>
                ) : error ? (
                  <Message variant="alert-danger">{error}</Message>
                ) : products.length < 1 ? (
                  <h4>Sin Productos</h4>
                ) : (
                  products.map((product, i) => (
                    <div
                      className="shop col-lg-4 col-md-6 col-sm-6"
                      key={product._id}
                    >
                      <div className="border-product">
                        <Link to={`/products/${product._id}`}>
                          <div className="shopBack">
                            <img src={product.image} alt={product.name} />
                          </div>
                        </Link>

                        <div className="shoptext">
                          <p>
                            <Link to={`/products/${product._id}`}>
                              <span>Producto:</span> {product.name}
                            </Link>
                          </p>
                          <p>
                            <Link to={`/products/${product._id}`}>
                              <span>Categoria:</span> {product.category?.name}
                            </Link>
                          </p>

                          <Rating
                            value={product.rating}
                            text={`${product.numReviews} valoraciones`}
                          />
                          <h3>Q{product.price}</h3>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Pagination */}
                <Pagination
                  pages={pages}
                  page={page}
                  isCategory={true}
                  idCategory={id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CalltoActionSection />
      <ContactInfo />
      <Footer />
    </>
  );
};

export default ProductForCategory;
