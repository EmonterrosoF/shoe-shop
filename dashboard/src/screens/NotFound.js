import React from "react";
import { Link } from "react-router-dom";

import notFound from "../assets/not-found.png";

const NotFound = () => {
  return (
    <>
      <div className="container my-5">
        <div className="row justify-content-center align-items-center">
          <h4 className="text-center mb-2 mb-sm-5">Pagina No Encontrada</h4>
          <img
            style={{ width: "100%", height: "300px", objectFit: "contain" }}
            src={notFound}
            alt="Pagina no encontrada"
          />
          <button className="col-md-3 col-sm-6 col-12 btn btn-success mt-5">
            <Link to="/" className="text-white text-decoration-none">
              Pagina de Inicio
            </Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
