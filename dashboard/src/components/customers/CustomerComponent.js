import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listCustomer } from "../../Redux/Actions/CustomerActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

import favicon from "../../assets/favicon.png";

const CustomerComponent = () => {
  const dispatch = useDispatch();

  const customerList = useSelector((state) => state.customerList);
  const { loading, error, customers } = customerList;

  useEffect(() => {
    dispatch(listCustomer());
  }, [dispatch]);
  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Clientes</h2>
        {/* <div>
          <Link to="#" className="btn btn-primary">
            <i className="material-icons md-plus"></i> Crear Nuevo
          </Link>
        </div> */}
      </div>

      <div className="card mb-4">
        <header className="card-header">
          <div className="row gx-3">
            <div className="col-lg-4 col-md-6 me-auto">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
              />
            </div>
            <div className="col-lg-2 col-6 col-md-3">
              <select className="form-select">
                <option>Show 20</option>
                <option>Show 30</option>
                <option>Show 40</option>
                <option>Show all</option>
              </select>
            </div>
            <div className="col-lg-2 col-6 col-md-3">
              <select className="form-select">
                <option>Status: all</option>
                <option>Active only</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </header>

        {/* Card */}
        <div className="card-body">
          {loading ? (
            <Loading />
          ) : error ? (
            <Message variant="alert-danger">{error}</Message>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
              {customers.map((user) => (
                <div className="col" key={user._id}>
                  <div className="card card-user shadow-sm">
                    <div className="card-header">
                      <img
                        className="img-md img-avatar"
                        src={favicon}
                        alt="Cliente imagen"
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title mt-5">{user.name}</h5>
                      <div className="card-text text-muted">
                        <p>
                          <a href={`mailto:${user.email}`}>{user.email}</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* nav */}
          <nav className="float-end mt-4" aria-label="Page navigation">
            <ul className="pagination">
              <li className="page-item disabled">
                <Link className="page-link" to="#">
                  Anterior
                </Link>
              </li>
              <li className="page-item active">
                <Link className="page-link" to="#">
                  1
                </Link>
              </li>
              <li className="page-item">
                <Link className="page-link" to="#">
                  Siguiente
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default CustomerComponent;
