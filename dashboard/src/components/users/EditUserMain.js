import React, { useState, useEffect } from "react";
import Toast from "./../LoadingError/Toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { USER_UPDATE_RESET } from "../../Redux/Constants/UserConstants";
import { toast } from "react-toastify";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { editUser, updateUser } from "../../Redux/Actions/userActions";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const EditUserMain = (props) => {
  const { userId } = props;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const userEdit = useSelector((state) => state.userEdit);
  const { loading, error, user } = userEdit;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      toast.success("Usuario Actualizado", ToastObjects);
    } else {
      if (!user?.name || user._id !== userId) {
        dispatch(editUser(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setPassword("");
      }
    }
  }, [user, dispatch, userId, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = {
      name,
      email,
      password,
    };

    dispatch(
      updateUser({
        _id: userId,
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
            <Link to="/users" className="btn btn-danger text-white">
              Ir a Usuarios
            </Link>
            <h2 className="content-title">Actualizar Usuario</h2>
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
                  {loadingUpdate && <Loading />}
                  {loading ? (
                    <Loading />
                  ) : error ? (
                    <Message variant="alert-danger">{error}</Message>
                  ) : (
                    <>
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

export default EditUserMain;
