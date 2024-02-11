import { useCallback, useEffect, useState } from "react";

const CustomPagination = (props: {
  meta: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  };
  navigatePage: Function;
}) => {
  const { totalItems, currentPage, itemsPerPage, totalPages } = props.meta;
  const { navigatePage } = props;
  const [pages, setPages] = useState<number[]>([]);
  const [start, setStart] = useState<number>(1);
  const [end, setEnd] = useState<number>(1);

  const getPages = () => {
    if (totalPages > 6) {
      if (currentPage >= 3 && currentPage + 3 <= totalPages) {
        let result: number[] = [];
        for (let i = currentPage - 3; i < currentPage + 3; i++) {
          result = [...result, i + 1];
        }
        return result;
      } else if (currentPage >= 3 && currentPage + 3 > totalPages) {
        let result: number[] = [];
        for (let i = currentPage - 3; i < totalPages; i++) {
          result = [...result, i + 1];
        }
        return result;
      } else if (currentPage < 3) {
        let result: number[] = [];
        for (let i = 0; i < totalPages; i++) {
          result = [...result, i + 1];
        }
        return result;
      } else {
        let result: number[] = [];
        for (let i = 0; i < totalPages; i++) {
          result = [...result, i + 1];
        }
        return result;
      }
    } else {
      let result: number[] = [];
      for (let i = 0; i < totalPages; i++) {
        result = [...result, i + 1];
      }
      return result;
    }
  };

  const getStartEnd = () => {
    if (currentPage === 1) {
      const testEnd = itemsPerPage > totalItems ? totalItems : itemsPerPage;
      setStart(1);
      setEnd(testEnd);
    } else {
      const testEnd =
        itemsPerPage * currentPage > totalItems
          ? totalItems
          : itemsPerPage * currentPage;
      setStart(currentPage * itemsPerPage - (itemsPerPage + 1));
      setEnd(testEnd);
    }
  };

  useEffect(() => {
    setPages(getPages());
    getStartEnd();
  }, []);

  return (
    <div className="d-flex flex-stack flex-wrap pt-10">
      <div className="fs-6 fw-bold text-gray-700">
        Showing {start} to {end} of {totalItems} entries
      </div>

      <ul className="pagination">
        <li className="page-item previous">
          <a
            className="page-link"
            onClick={() => {
              if (currentPage >= 2) {
                navigatePage(currentPage - 1);
              }
            }}
          >
            <i className="previous"></i>
          </a>
        </li>

        {pages?.map((p: number, i: number) => {
          return (
            <li
              className={`page-item ${p === currentPage ? "active" : ""}`}
              key={i}
            >
              <a
                onClick={() => {
                  navigatePage(p);
                }}
                className="page-link"
              >
                {p}
              </a>
            </li>
          );
        })}

        <li className="page-item next">
          <a
            onClick={() => {
              if (currentPage + 1 <= totalPages) {
                navigatePage(currentPage + 1);
              }
            }}
            className="page-link"
          >
            <i className="next"></i>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default CustomPagination;
