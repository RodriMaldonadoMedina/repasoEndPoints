import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";


const Registro = () => {
  const [datos, setDatos] = useState({});
  const { actions } = useContext(Context);
  const nav = useNavigate();

  function inputChange(e) {
    setDatos({ ...datos, [e.target.type]: e.target.value });
  }

  function datosCargados(e) {
    e.preventDefault();
    actions.cargarUsuario(datos);
    setTimeout(()=>{
      nav("/products");
    },500)
  }

  return (
    <div className="container">
      <form onSubmit={datosCargados}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            value={datos.email}
            onChange={inputChange}
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            value={datos.password}
            onChange={inputChange}
            className="form-control"
            id="password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Registro;