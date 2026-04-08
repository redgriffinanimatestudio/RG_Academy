"use client";
import Link from "next/link";
import React, { useState } from "react";

const AddToCart = () => {
  let [count, setCount] = useState(0);

  let increaseCount = () => {
    setCount(count + 1);
  };
  let decreaseCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  return (
    <div className='cart-item-single'>
      <div className='cart-item-thumb'>
        <Link href='/service-details'>
          <img src='/assets/images/cart.jpg' alt='Image_inner' />
        </Link>
      </div>
      <div className='cart-item-content'>
        <h6 className='h6 title-anim'>
          <Link href='/service-details'>Product One</Link>
        </h6>
        <p className='price'>
          $<span className='item-price'>34.99</span>
        </p>
        <div className='measure'>
          <button
            aria-label='decrease item'
            className='quantity-decrease'
            onClick={decreaseCount}
          >
            <i className='fa-solid fa-minus' />
          </button>
          <span className='item-quantity'>{count}</span>
          <button
            aria-label='add item'
            className='quantity-increase'
            onClick={increaseCount}
          >
            <i className='fa-solid fa-plus' />
          </button>
        </div>
      </div>
      <button aria-label='delete item' className='delete-item'>
        <i className='fa-solid fa-trash' />
      </button>
    </div>
  );
};

export default AddToCart;
