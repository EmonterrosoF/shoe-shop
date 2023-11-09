import React from "react";
import Sidebar from "./../components/sidebar";
import Header from "./../components/Header";
import MainCategories from "./../components/Categories/MainCategories";

const CategoriesScreen = ({ match }) => {
  const categoryId = match.params.id;

  return (
    <>
      <Sidebar />
      <main className="main-wrap">
        <Header />
        <MainCategories categoryId={categoryId} />
      </main>
    </>
  );
};

export default CategoriesScreen;
