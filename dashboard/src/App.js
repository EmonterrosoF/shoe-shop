import React, { useEffect } from "react";
import "./App.css";
import "./responsive.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/productScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderDetailScreen from "./screens/OrderDetailScreen";
import AddProduct from "./screens/AddProduct";
import Login from "./screens/LoginScreen";
import CustomersScreen from "./screens/CustomerScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import NotFound from "./screens/NotFound";
import PrivateRouter from "./PrivateRouter";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "./Redux/Actions/ProductActions";
import { listOrders } from "./Redux/Actions/OrderActions";
import UsersScreen from "./screens/UserScreen";
import AddUserScreen from "./screens/AddUser";
import UserEditScreen from "./screens/UserEditScreen";
import UserPerfileScreen from "./screens/UserPerfileScreen";

function App() {
  const dispatch = useDispatch();
  // localStorage.removeItem("userInfo");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      dispatch(listProducts());
      dispatch(listOrders());
    }
  }, [dispatch, userInfo]);

  return (
    <>
      <Router
        basename={process.env.NODE_ENV === "production" ? "dashboard" : ""}
      >
        <Switch>
          <PrivateRouter path="/" component={HomeScreen} exact />
          <PrivateRouter path="/products" component={ProductScreen} />
          <PrivateRouter path="/category/:id" component={CategoriesScreen} />
          <PrivateRouter path="/category" component={CategoriesScreen} />
          <PrivateRouter path="/orders" component={OrderScreen} />
          <PrivateRouter path="/order/:id" component={OrderDetailScreen} />
          <PrivateRouter path="/addproduct" component={AddProduct} />
          <PrivateRouter
            needAdmin={true}
            path="/users"
            component={UsersScreen}
          />
          <PrivateRouter
            needAdmin={true}
            path="/adduser"
            component={AddUserScreen}
          />
          <PrivateRouter
            needAdmin={true}
            path="/user/:id/edit"
            component={UserEditScreen}
          />
          <PrivateRouter path="/user/perfile" component={UserPerfileScreen} />

          <PrivateRouter path="/customers" component={CustomersScreen} />
          <PrivateRouter
            path="/product/:id/edit"
            component={ProductEditScreen}
          />
          <Route path="/login" component={Login} />
          <PrivateRouter path="*" component={NotFound} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
