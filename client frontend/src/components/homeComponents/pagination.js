import React from "react";
import { Link } from "react-router-dom";

const Pagination = ({
  page,
  pages,
  keyword = "",
  isCategory = false,
  idCategory = "",
}) => {
  return (
    pages > 1 && (
      <nav>
        <ul className="pagination justify-content-center">
          {[...Array(pages).keys()].map((x) => (
            <li
              className={`page-item ${x + 1 === page ? "active" : ""}`}
              key={x + 1}
            >
              <Link
                className="page-link"
                to={
                  isCategory
                    ? `/category/page/${idCategory}/${x + 1}`
                    : keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
                }
              >
                {x + 1}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    )
  );
};

export default Pagination;
