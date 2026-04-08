"use client";
import Link from "next/link";
import { useState } from "react";
import Slider from "react-slick";

const ProductDetailsInner = () => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [active, setActive] = useState(1);

  let [count, setCount] = useState(0);

  let increaseCount = () => {
    setCount(count + 1);
  };
  let decreaseCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const gallerySettings = {
    asNavFor: nav1,
    ref: (slider) => setNav2(slider),
    slidesToShow: 4,
    swipeToSlide: true,
    focusOnSelect: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
        },
      },
    ],
  };

  const mainSliderSettings = {
    asNavFor: nav2,
    ref: (slider) => setNav1(slider),
    slidesToShow: 1,
    swipeToSlide: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "0px",
  };
  return (
    <>
      <section className='product-details'>
        <div className='container'>
          <div className='row align-items-center gutter-40'>
            <div className='col-12 col-xl-6'>
              <div className='product-details__slider'>
                <div className='product-details__slider-thumb'>
                  <div className='product-details-slider swiper'>
                    <Slider {...mainSliderSettings} className='swiper-wrapper'>
                      <div className='swiper-slide'>
                        <div className='product-details-slider-single'>
                          <img
                            src='assets/images/shop/product-details.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                      <div className='swiper-slide'>
                        <div className='product-details-slider-single'>
                          <img
                            src='assets/images/shop/product-details.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                      <div className='swiper-slide'>
                        <div className='product-details-slider-single'>
                          <img
                            src='assets/images/shop/product-details.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                      <div className='swiper-slide'>
                        <div className='product-details-slider-single'>
                          <img
                            src='assets/images/shop/product-details.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                      <div className='swiper-slide'>
                        <div className='product-details-slider-single'>
                          <img
                            src='assets/images/shop/product-details.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                      <div className='swiper-slide'>
                        <div className='product-details-slider-single'>
                          <img
                            src='assets/images/shop/product-details.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                      <div className='swiper-slide'>
                        <div className='product-details-slider-single'>
                          <img
                            src='assets/images/shop/product-details.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                      <div className='swiper-slide'>
                        <div className='product-details-slider-single'>
                          <img
                            src='assets/images/shop/product-details.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                    </Slider>
                  </div>
                </div>
                <div className='product-details-slider-gallery swiper'>
                  <Slider {...gallerySettings} className='swiper-wrapper'>
                    <div className='swiper-slide px-1'>
                      <div className='sm-gallery'>
                        <img
                          src='assets/images/shop/cart-one.png'
                          alt='Image_inner'
                        />
                      </div>
                    </div>
                    <div className='swiper-slide px-1'>
                      <div className='sm-gallery'>
                        <img
                          src='assets/images/shop/cart-two.png'
                          alt='Image_inner'
                        />
                      </div>
                    </div>
                    <div className='swiper-slide px-1'>
                      <div className='sm-gallery'>
                        <img
                          src='assets/images/shop/cart-three.png'
                          alt='Image_inner'
                        />
                      </div>
                    </div>
                    <div className='swiper-slide px-1'>
                      <div className='sm-gallery'>
                        <img
                          src='assets/images/shop/cart-four.png'
                          alt='Image_inner'
                        />
                      </div>
                    </div>
                    <div className='swiper-slide px-1'>
                      <div className='sm-gallery'>
                        <img
                          src='assets/images/shop/cart-one.png'
                          alt='Image_inner'
                        />
                      </div>
                    </div>
                    <div className='swiper-slide px-1'>
                      <div className='sm-gallery'>
                        <img
                          src='assets/images/shop/cart-two.png'
                          alt='Image_inner'
                        />
                      </div>
                    </div>
                    <div className='swiper-slide px-1'>
                      <div className='sm-gallery'>
                        <img
                          src='assets/images/shop/cart-three.png'
                          alt='Image_inner'
                        />
                      </div>
                    </div>
                    <div className='swiper-slide px-1'>
                      <div className='sm-gallery'>
                        <img
                          src='assets/images/shop/cart-four.png'
                          alt='Image_inner'
                        />
                      </div>
                    </div>
                  </Slider>
                </div>
              </div>
            </div>
            <div className='col-12 col-xl-6'>
              <div
                className='product-details__content'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={100}
              >
                <div className='review-wrapper'>
                  <span>-5%</span>
                  <div className='review'>
                    <i className='icon-star' />
                    <i className='icon-star' />
                    <i className='icon-star' />
                    <i className='icon-star' />
                    <i className='icon-star' />
                  </div>
                  <p>(2) Reviews</p>
                </div>
                <div className='product-meta'>
                  <h3 className='title-animation_inner'>
                    Smart Wirless Headphone
                  </h3>
                  <p>
                    There are many variations of passages of Lorem Ipsum
                    available, but majority have suffered teration in some form,
                    by injected humour, or randomised
                  </p>
                </div>
                <div className='product-price'>
                  <h4>$600</h4>
                  <h6>
                    <del>$900.00</del>
                  </h6>
                </div>
                <div className='product-color'>
                  <p>Color:</p>
                  <div className='product-colors'>
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className='product-size'>
                  <p>Size:</p>
                  <div className='product-sizes'>
                    <span>S</span>
                    <span>M</span>
                    <span>L</span>
                    <span>XL</span>
                    <span>XXL</span>
                  </div>
                </div>
                <div className='product-quantity cart-item-single'>
                  <p>Quantity:</p>
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
                </div>
                <div className='product-cta'>
                  <Link
                    href='/cart'
                    aria-label='add to cart'
                    title='add to cart'
                    className='btn--primary'
                  >
                    Add To Cart <i className='fa-solid fa-cart-shopping' />
                  </Link>
                  <Link href='/cart' className='fav-btn'>
                    <i className='icon-heart' />
                  </Link>
                </div>
                <div className='productsku'>
                  <p>
                    Ground Delivery Charge: <strong>$180.00</strong>
                  </p>
                </div>
                <div className='sku'>
                  <p>
                    <strong>SKU:</strong> N/A
                  </p>
                  <p>
                    <strong>Category:</strong> Electronics
                  </p>
                  <p>
                    <strong>Tags:</strong> mobile, gadget
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='product-tab'>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <div className='product-tab__inner'>
                <div className='product-tab__btns'>
                  <button
                    onClick={() => setActive(1)}
                    className={`product-tab__btn ${active === 1 && "active"}`}
                    data-target='#productDetails'
                    aria-label='product details'
                    title='product details'
                  >
                    Product Details
                  </button>
                  <button
                    onClick={() => setActive(2)}
                    className={`product-tab__btn ${active === 2 && "active"}`}
                    data-target='#pInformation'
                    aria-label='product information'
                    title='product information'
                  >
                    Additional Information
                  </button>
                  <button
                    onClick={() => setActive(3)}
                    className={`product-tab__btn ${active === 3 && "active"}`}
                    data-target='#pInformation'
                    aria-label='product information'
                    title='product information'
                  >
                    Reviews
                  </button>
                </div>
                <div className='product-tab__content'>
                  <div
                    className={`product-tab-content-single ${
                      active === 1 ? "d-block" : "d-none"
                    }`}
                    id='productDetails'
                  >
                    <div className='content'>
                      <h4>Experience is over the world visit</h4>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Curabitur vulputate vestibulum Phasellus rhoncus, dolor
                        eget viverra pretium, dolor tellus aliquet nu vitae
                        ultricies erat elit eu lacus. Vestibulum non justo
                        consectetur, cursus ante, tincidunt sapien. Nulla quis
                        diam sit amet turpis interdum accumsan quis nec enim.
                        Vivamus faucibus ex sed nibh egestas elementum. Mauris
                        et bibendum dui. Aenean consequat pulvinar luctus
                      </p>
                    </div>
                    <div className='content-list cta'>
                      <h5>More Details</h5>
                      <ul>
                        <li>
                          <i className='fa-solid fa-check' />
                          Lorem Ipsum is simply dummy text.
                        </li>
                        <li>
                          <i className='fa-solid fa-check' />
                          Lorem Ipsum is simply dummy text.
                        </li>
                        <li>
                          <i className='fa-solid fa-check' />
                          Lorem Ipsum is simply dummy text.
                        </li>
                        <li>
                          <i className='fa-solid fa-check' />
                          Lorem Ipsum is simply dummy text.
                        </li>
                        <li>
                          <i className='fa-solid fa-check' />
                          Lorem Ipsum is simply dummy text.
                        </li>
                        <li>
                          <i className='fa-solid fa-check' />
                          Lorem Ipsum is simply dummy text.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className={`product-tab-content-single ${
                      active === 2 ? "d-block" : "d-none"
                    }`}
                    id='productDetails'
                  >
                    <div className='content'>
                      <h4>Experience is over the world visit</h4>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Curabitur vulputate vestibulum Phasellus rhoncus, dolor
                        eget viverra pretium, dolor tellus aliquet nu vitae
                        ultricies erat elit eu lacus. Vestibulum non justo
                        consectetur, cursus ante, tincidunt sapien. Nulla quis
                        diam sit amet turpis interdum accumsan quis nec enim.
                        Vivamus faucibus ex sed nibh egestas elementum. Mauris
                        et bibendum dui. Aenean consequat pulvinar luctus
                      </p>
                    </div>
                    <div className='content-list cta'>
                      <h5>More Details</h5>
                      <ul>
                        <li>
                          <i className='fa-solid fa-check' />
                          Lorem Ipsum is simply dummy text.
                        </li>
                        <li>
                          <i className='fa-solid fa-check' />
                          Lorem Ipsum is simply dummy text.
                        </li>
                        <li>
                          <i className='fa-solid fa-check' />
                          Lorem Ipsum is simply dummy text.
                        </li>
                        <li>
                          <i className='fa-solid fa-check' />
                          Lorem Ipsum is simply dummy text.
                        </li>
                        <li>
                          <i className='fa-solid fa-check' />
                          Lorem Ipsum is simply dummy text.
                        </li>
                        <li>
                          <i className='fa-solid fa-check' />
                          Lorem Ipsum is simply dummy text.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className={`product-tab-content-single ${
                      active === 3 ? "d-block" : "d-none"
                    }`}
                    id='pInformation'
                  >
                    <div className='cm-details init__padding'>
                      <div className='content'>
                        <div
                          className='blog-comment aos-init aos-animate'
                          data-aos='fade-up'
                          data-aos-duration={1000}
                          data-aos-delay={100}
                        >
                          <div className='comment-header '>
                            <h4 className='mt-8 '>03 Reviews</h4>
                          </div>
                          <div className='comment-single'>
                            <div className='thumb'>
                              <img
                                alt='Image_inner'
                                src='assets/images/author-four.png'
                              />
                            </div>
                            <div className='comment-single__content'>
                              <h5>Martha Grey</h5>
                              <p>
                                Ut sint posse sit, eum sumo diam ea. Liber
                                consectetuer in mei, sea in imperdiet assueverit
                                contentiones, an his cib.
                              </p>
                              <div className='comment-single__meta'>
                                <button title='like' className='single'>
                                  <i className='icon-heart' /> Like
                                </button>
                                <div className='reply-button'>
                                  <button aria-label='reply'>
                                    <i className='fa-solid fa-reply' />
                                    Reply
                                  </button>
                                </div>
                                <p>2 min ago</p>
                              </div>
                              <div className='reply-comment'>
                                <form action='#' method='post'>
                                  <div className='input-group'>
                                    <div className='input-single'>
                                      <textarea
                                        placeholder='Join the discussion...'
                                        defaultValue={""}
                                      />
                                    </div>
                                    <div className='btn-wrapper'>
                                      <button
                                        type='submit'
                                        className='btn--secondary'
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                          <div className='comment-single comment-single-reply'>
                            <div className='thumb'>
                              <img
                                alt='Image_inner'
                                src='assets/images/team/one.png'
                              />
                            </div>
                            <div className='comment-single__content'>
                              <h5>Jackie Dawson</h5>
                              <p>
                                Ut sint posse sit, eum sumo diam ea. Liber
                                consectetuer in mei, sea in imperdiet assueverit
                                contentiones, an his cib.
                              </p>
                              <div className='comment-single__meta'>
                                <button title='like' className='single'>
                                  <i className='icon-heart' /> Like
                                </button>
                                <div className='reply-button'>
                                  <button aria-label='reply'>
                                    <i className='fa-solid fa-reply' />
                                    Reply
                                  </button>
                                </div>
                                <p>2 min ago</p>
                              </div>
                              <div className='reply-comment'>
                                <form action='#' method='post'>
                                  <div className='input-group'>
                                    <div className='input-single'>
                                      <textarea
                                        placeholder='Join the discussion...'
                                        defaultValue={""}
                                      />
                                    </div>
                                    <div className='btn-wrapper'>
                                      <button
                                        type='submit'
                                        className='btn--secondary'
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                          <div className='comment-single'>
                            <div className='thumb'>
                              <img
                                alt='Image_inner'
                                src='assets/images/author-two.png'
                              />
                            </div>
                            <div className='comment-single__content'>
                              <h5>Hesia Lara</h5>
                              <p>
                                Ut sint posse sit, eum sumo diam ea. Liber
                                consectetuer in mei, sea in imperdiet assueverit
                                contentiones, an his cib.
                              </p>
                              <div className='comment-single__meta'>
                                <button title='like' className='single'>
                                  <i className='icon-heart' /> Like
                                </button>
                                <div className='reply-button'>
                                  <button aria-label='reply'>
                                    <i className='fa-solid fa-reply' />
                                    Reply
                                  </button>
                                </div>
                                <p>2 min ago</p>
                              </div>
                              <div className='reply-comment'>
                                <form action='#' method='post'>
                                  <div className='input-group'>
                                    <div className='input-single'>
                                      <textarea
                                        placeholder='Join the discussion...'
                                        defaultValue={""}
                                      />
                                    </div>
                                    <div className='btn-wrapper'>
                                      <button
                                        type='submit'
                                        className='btn--secondary'
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                          <div
                            className='comment__form mt-120 aos-init aos-animate'
                            data-aos='fade-up'
                            data-aos-duration={1000}
                            data-aos-delay={100}
                          >
                            <div className='comment-header mb-40'>
                              <h4 className='mt-8 fw-6'>Leave A Comment</h4>
                            </div>
                            <form action='#' method='post'>
                              <div className='form-group'>
                                <div className='input-icon'>
                                  <input
                                    id='commentName'
                                    placeholder='Your Name'
                                    type='text'
                                    name='comment-name'
                                  />
                                  <i className='fa-solid fa-user' />
                                </div>
                                <div className='input-icon'>
                                  <input
                                    id='commentEmail'
                                    placeholder='Enter Email'
                                    type='email'
                                    name='comment-email'
                                  />
                                  <i className='fa-regular fa-envelope' />
                                </div>
                              </div>
                              <div className='input-icon input-icon-alt'>
                                <textarea
                                  name='comment-message'
                                  id='commentMessage'
                                  cols={30}
                                  rows={10}
                                  placeholder='Type Your Comments...'
                                  defaultValue={""}
                                />
                                <i className='fa-regular fa-comments' />
                              </div>
                              <div className='cta mt-40'>
                                <div className='btn-wrapper'>
                                  <button
                                    type='submit'
                                    className='btn--secondary'
                                  >
                                    Submit Comment
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsInner;
