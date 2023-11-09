import React from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/Header";
import CustomerComponent from "../components/customers/CustomerComponent";

const CustomerScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <CustomerComponent />
      </main>
    </>
  );
};

export default CustomerScreen;
