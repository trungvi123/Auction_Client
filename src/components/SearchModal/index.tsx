import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IRootState } from "../../interface";
import { setCloseSearch } from "../../redux/searchModalSlice";

import "./SearchModal.css";

function SearchModal({ name, placement }: { name: string; placement: any }) {
  const searchModal = useSelector((e: IRootState) => e.searchModal);
  const [keyword, setKeyWord] = useState<string>();
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setCloseSearch());
  };

  return (
    <>
      <Offcanvas
        className={name}
        show={searchModal.show}
        onHide={handleClose}
        placement={placement}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Nhập từ khóa tìm kiếm</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <input
            className="search-input"
            type="text"
            onChange={(e: any) => setKeyWord(e.target.value)}
            placeholder="Tìm kiếm"
          />
        </Offcanvas.Body>
        <div className="d-flex w-100 justify-content-center">
          <div
            className="w-25"
            onClick={() => {
              setKeyWord("");
              handleClose();
            }}
          >
            <Link
              to={keyword ? `/tim-kiem?keyword=${keyword}` : ''}
              className="btn-11 btn-11__full"
            >
              <span className="btn-11__content">Tìm kiếm</span>
            </Link>
          </div>
        </div>
      </Offcanvas>
    </>
  );
}

export default SearchModal;
