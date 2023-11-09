import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

function PrivateRouter({ needAdmin = false, component: Component, ...rest }) {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <Route
      {...rest}
      component={(props) => {
        if (userInfo?.isAdmin) {
          return <Component {...props} />;
        } else if (userInfo && !needAdmin) {
          return <Component {...props} />;
        } else if (needAdmin) {
          return <Redirect to={`/`} />;
        } else {
          return <Redirect to={`/login`} />;
        }
      }}
    />
  );
}

export default PrivateRouter;
