"use client";
import Link from "next/link";
import { useState } from "react";

const CartInner = () => {
  return (
    <section className='cart-main'>
      <div className='container'>
        <div className='row gutter-60'>
          <div className='col-12 col-xl-8'>
            <div
              className='cart__inner'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='cart-table'>
                <table>
                  <tbody>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                    <tr className='cart-item-single'>
                      <td className='cart-product'>
                        <div className='cart-product-wrapper'>
                          <div className='thumb'>
                            <Link href='/product-details'>
                              <img
                                src='assets/images/shop/cart-three.png'
                                alt='Image_inner'
                              />
                            </Link>
                            <button
                              aria-label='delete item'
                              className='delete-item'
                            >
                              <i className='fa-solid fa-circle-xmark' />
                            </button>
                          </div>
                          <div className='content'>
                            <p>
                              <Link href='/product-details'>Apple Watch</Link>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className='price'>$12.00</p>
                      </td>
                      <td>
                        <QTY />
                      </td>
                      <td>
                        <p className='sub'>$60.00</p>
                      </td>
                    </tr>
                    <tr className='cart-item-single'>
                      <td className='cart-product'>
                        <div className='cart-product-wrapper'>
                          <div className='thumb'>
                            <Link href='/product-details'>
                              <img
                                src='assets/images/shop/cart-four.png'
                                alt='Image_inner'
                              />
                            </Link>
                            <button
                              aria-label='delete item'
                              className='delete-item'
                            >
                              <i className='fa-solid fa-circle-xmark' />
                            </button>
                          </div>
                          <div className='content'>
                            <p>
                              <Link href='/product-details'>
                                Sumsang Hand Set
                              </Link>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className='price'>$67.00</p>
                      </td>
                      <td>
                        <QTY />
                      </td>
                      <td>
                        <p className='sub'>$67.00</p>
                      </td>
                    </tr>
                    <tr className='cart-item-single'>
                      <td className='cart-product'>
                        <div className='cart-product-wrapper'>
                          <div className='thumb'>
                            <Link href='/product-details'>
                              <img
                                src='assets/images/shop/cart-two.png'
                                alt='Image_inner'
                              />
                            </Link>
                            <button
                              aria-label='delete item'
                              className='delete-item'
                            >
                              <i className='fa-solid fa-circle-xmark' />
                            </button>
                          </div>
                          <div className='content'>
                            <p>
                              <Link href='/product-details'>
                                Tata Brand Car
                              </Link>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className='price'>$87.00</p>
                      </td>
                      <td>
                        <QTY />
                      </td>
                      <td>
                        <p className='sub'>$87.00</p>
                      </td>
                    </tr>
                    <tr className='cart-item-single'>
                      <td className='cart-product'>
                        <div className='cart-product-wrapper'>
                          <div className='thumb'>
                            <Link href='/product-details'>
                              <img
                                src='assets/images/shop/cart-one.png'
                                alt='Image_inner'
                              />
                            </Link>
                            <button
                              aria-label='delete item'
                              className='delete-item'
                            >
                              <i className='fa-solid fa-circle-xmark' />
                            </button>
                          </div>
                          <div className='content'>
                            <p>
                              <Link href='/product-details'>
                                Sumsang Hand Set
                              </Link>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className='price'>$99.00</p>
                      </td>
                      <td>
                        <QTY />
                      </td>
                      <td>
                        <p className='sub'>$99.00</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='update-cart'>
                <Link href='/shop'>Return To Shop</Link>
                <Link href='/cart'>Update Cart</Link>
              </div>
              <div className='coupon-wrapper'>
                <div className='left-c'>
                  <h6>Coupon Code</h6>
                </div>
                <div className='right-c'>
                  <form action='#' method='post'>
                    <div className='input-single'>
                      <input
                        type='text'
                        required=''
                        name='c-code'
                        id='cCcode'
                        placeholder='Enter Coupon'
                      />
                    </div>
                    <button
                      type='submit'
                      aria-label='subscribe to our newsletter'
                      title='subscribe to our newsletter'
                      className='btn--primary'
                    >
                      Apply Coupon
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-xl-4'>
            <div className='cart-main__content'>
              <div
                className='cart-main__single'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={100}
              >
                <div className='intro'>
                  <h6>Calculate Shipping</h6>
                </div>
                <div className='content'>
                  <div className='content-single'>
                    <p>Country</p>
                    <p>Australia</p>
                  </div>
                  <div className='content-single'>
                    <p>Street</p>
                    <p>#67, Chunkook Street</p>
                  </div>
                  <div className='content-single'>
                    <p>Zip Code</p>
                    <p>49870</p>
                  </div>
                  <Link href='/checkout' aria-label='Shipping' title='Shipping'>
                    Calculate Shiping
                  </Link>
                </div>
              </div>
              <div
                className='cart-main__single'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={300}
              >
                <div className='intro'>
                  <h6>Total Cart</h6>
                </div>
                <div className='content'>
                  <div className='content-single'>
                    <p>Subtotal</p>
                    <p>$345.00</p>
                  </div>
                  <div className='content-single'>
                    <p>Total</p>
                    <p>$450.00</p>
                  </div>
                  <Link
                    href='/checkout'
                    aria-label='Shipping'
                    title='Shipping'
                    className='total'
                  >
                    Procced to checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const QTY = () => {
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
    <div className='measure'>
      <button
        onClick={decreaseCount}
        aria-label='decrease item'
        className='quantity-decrease'
      >
        <i className='fa-solid fa-minus' />
      </button>
      <span className='item-quantity'>{count}</span>
      <button
        onClick={increaseCount}
        aria-label='add item'
        className='quantity-increase'
      >
        <i className='fa-solid fa-plus' />
      </button>
    </div>
  );
};

export default CartInner;
