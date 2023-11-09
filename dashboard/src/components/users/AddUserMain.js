import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PRODUCT_CREATE_RESET } from "../../Redux/Constants/ProductConstants";
import { createUser } from "./../../Redux/Actions/userActions";
import Toast from "../LoadingError/Toast";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
const AddUserMain = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const userCreate = useSelector((state) => state.userCreate);
  const { loading, error, user } = userCreate;

  useEffect(() => {
    if (user) {
      toast.success("Usuario Agregado", ToastObjects);
      dispatch({ type: PRODUCT_CREATE_RESET });
      setName("");
      setEmail("");
      setPassword("");
    }
  }, [user, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createUser({ name, email, password }));
  };

  return (
    <>
      <Toast />
      <section className="content-main " style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/users" className="btn btn-danger text-white">
              Ir a Usuarios
            </Link>
            <h2 className="content-title">Agregar Usuario</h2>
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

                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      *Nombre
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
                    <label htmlFor="product_title" className="form-label">
                      *Correo
                    </label>
                    <input
                      required
                      className="form-control"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      *Contraseña
                    </label>
                    <input
                      required
                      className="form-control"
                      placeholder="Contraseña"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

export default AddUserMain;
