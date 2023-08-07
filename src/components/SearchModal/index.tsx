import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../interface';
import { setCloseSearch } from '../../redux/searchModalSlice';

import './SearchModal.css'



function SearchModal({ name, placement }:{name:string,placement:any}) {
  const searchModal = useSelector((e:IRootState)=>e.searchModal)
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(setCloseSearch())
  }

  return (
    <>
      <Offcanvas className={name} show={searchModal.show} onHide={handleClose} placement={placement}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Nhập từ khóa tìm kiếm</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <input className='search-input' type='text' placeholder="Tìm kiếm" />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SearchModal