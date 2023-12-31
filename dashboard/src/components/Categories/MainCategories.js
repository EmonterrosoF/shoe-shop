import React from "react";
import CreateCategory from "./CreateCategory";
import CategoriesTable from "./CategoriesTable";

const MainCategories = ({ categoryId }) => {
  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Categorias</h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row">
            {/* Create category */}
            <CreateCategory categoryId={categoryId} />
            {/* Categories table */}
            <CategoriesTable />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainCategories;
