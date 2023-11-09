import React from "react";
import Sidebar from "../components/sidebar";
import Header from "../components/Header";
import PerfileUserMain from "../components/users/PerfileUserMain";

const UserPerfileScreen = () => {
  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <PerfileUserMain />
      </main>
    </>
  );
};
export default UserPerfileScreen;
