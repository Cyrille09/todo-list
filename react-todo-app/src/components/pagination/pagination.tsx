"use client";
import ReactPaginate from "react-paginate";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import "./pagination.scss";

export function Pagination({
  pageCount,
  handlePageClick,
  forcePage,
  total,
  perPage,
}: {
  pageCount: number;
  handlePageClick: (value: any) => void;
  forcePage: number;
  total: number;
  perPage: number;
}) {
  const currentPage = forcePage - 1;
  const perPageTotal = Math.min(total, perPage * forcePage);

  return (
    <div className="pagination">
      <ReactPaginate
        nextLabel={<FaAngleRight />}
        previousLabel={<FaAngleLeft />}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
        pageRangeDisplayed={1}
        forcePage={currentPage}
      />
      <div className="pagination-content">
        <p>{`${forcePage} - ${perPageTotal} of ${total}`}</p>
      </div>
    </div>
  );
}
