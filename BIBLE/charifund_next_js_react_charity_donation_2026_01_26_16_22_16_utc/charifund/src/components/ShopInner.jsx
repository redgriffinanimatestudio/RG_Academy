"use client";
import Link from "next/link";
import NiceSelect from "nice-select2";
import { useEffect, useRef } from "react";

const ShopInner = () => {
  const priceRef = useRef(null);

  useEffect(() => {
    if (priceRef.current) {
      new NiceSelect(priceRef.current);
    }
  }, []);
  return (
    <section className='shop'>
      <div className='container'>
        <div className='row gutter-40'>
          <div className='col-12 col-xl-3'>
            <div className='shop__sidebar'>
              <div
                className='shop-sidebar-widget'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={100}
              >
                <div className='intro'>
                  <h5>search here</h5>
                </div>
                <form action='#' method='post'>
                  <input
                    type='text'
                    name='search-product'
                    id='searchProduct'
                    placeholder='Search Here...'
                    required=''
                  />
                  <button type='submit'>
                    <i className='fa-solid fa-magnifying-glass' />
                  </button>
                </form>
              </div>
              <div
                className='shop-sidebar-widget'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={100}
              >
                <div className='intro'>
                  <h5>Categories</h5>
                </div>
                <div className='sidebar-list'>
                  <ul>
                    <li>
                      <Link href='/shop'>
                        <i className='fa-solid fa-angle-right' />
                        Brochures
                      </Link>
                    </li>
                    <li>
                      <Link href='/shop'>
                        <i className='fa-solid fa-angle-right' />
                        Business Cards
                      </Link>
                    </li>
                    <li>
                      <Link href='/shop'>
                        <i className='fa-solid fa-angle-right' />
                        Calendars printing
                      </Link>
                    </li>
                    <li>
                      <Link href='/shop'>
                        <i className='fa-solid fa-angle-right' />
                        Design Online
                      </Link>
                    </li>
                    <li>
                      <Link href='/shop'>
                        <i className='fa-solid fa-angle-right' />
                        Flyers Design
                      </Link>
                    </li>
                    <li>
                      <Link href='/shop'>
                        <i className='fa-solid fa-angle-right' />
                        Folded Leaflets
                      </Link>
                    </li>
                    <li>
                      <Link href='/shop'>
                        <i className='fa-solid fa-angle-right' />
                        t-shirt printing
                      </Link>
                    </li>
                    <li>
                      <Link href='/shop'>
                        <i className='fa-solid fa-angle-right' />
                        Gift item printing
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className='shop-sidebar-widget'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={100}
              >
                <div className='intro'>
                  <h5>Filter By Price</h5>
                </div>
                <div className='filter-wrapper'>
                  <div className='price-slide'>
                    <input
                      className='range__slider'
                      type='range'
                      name='price__range'
                      id='priceRange'
                      max={200}
                      min={1}
                      defaultValue={100}
                    />
                  </div>
                  <div className='filter-cta'>
                    <p>$0 - $200</p>
                    <button
                      className='btn--primary'
                      aria-label='filter'
                      title='filter'
                    >
                      Filter
                    </button>
                  </div>
                </div>
              </div>
              <div
                className='shop-sidebar-widget'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={100}
              >
                <div className='intro'>
                  <h5>Select By Size</h5>
                </div>
                <div className='size-wrapper'>
                  <div className='radio-single'>
                    <input
                      type='radio'
                      id='sizeOne'
                      name='donation-payment'
                      defaultChecked=''
                    />
                    <label htmlFor='sizeOne'>36"x80" (8)</label>
                  </div>
                  <div className='radio-single'>
                    <input type='radio' id='sizeTwo' name='donation-payment' />
                    <label htmlFor='sizeTwo'>36"x96" (60)</label>
                  </div>
                  <div className='radio-single'>
                    <input
                      type='radio'
                      id='sizeThree'
                      name='donation-payment'
                    />
                    <label htmlFor='sizeThree'>72"x80" (7)</label>
                  </div>
                  <div className='radio-single'>
                    <input type='radio' id='sizeFour' name='donation-payment' />
                    <label htmlFor='sizeFour'>72"x96" (21)</label>
                  </div>
                </div>
              </div>
              <div
                className='shop-sidebar-widget'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={100}
              >
                <div className='intro'>
                  <h5>Filter By Ratings</h5>
                </div>
                <div className='review-wrapper size-wrapper'>
                  <div className='radio-single'>
                    <input
                      type='radio'
                      id='reviewOne'
                      name='donation-payment'
                      defaultChecked=''
                    />
                    <label htmlFor='reviewOne'>
                      <span className='review'>
                        <i className='icon-star checked' />
                        <i className='icon-star checked' />
                        <i className='icon-star checked' />
                        <i className='icon-star checked' />
                        <i className='icon-star checked' />
                      </span>
                      (5 Star)
                    </label>
                  </div>
                  <div className='radio-single'>
                    <input
                      type='radio'
                      id='reviewTwo'
                      name='donation-payment'
                    />
                    <label htmlFor='reviewTwo'>
                      <span className='review'>
                        <i className='icon-star checked' />
                        <i className='icon-star checked' />
                        <i className='icon-star checked' />
                        <i className='icon-star checked' />
                        <i className='icon-star' />
                      </span>
                      (4 Star)
                    </label>
                  </div>
                  <div className='radio-single'>
                    <input
                      type='radio'
                      id='reviewThree'
                      name='donation-payment'
                    />
                    <label htmlFor='reviewThree'>
                      <span className='review'>
                        <i className='icon-star checked' />
                        <i className='icon-star checked' />
                        <i className='icon-star checked' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </span>
                      (3 Star)
                    </label>
                  </div>
                  <div className='radio-single'>
                    <input
                      type='radio'
                      id='reviewFour'
                      name='donation-payment'
                    />
                    <label htmlFor='reviewFour'>
                      <span className='review'>
                        <i className='icon-star checked' />
                        <i className='icon-star checked' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </span>
                      (2 Star)
                    </label>
                  </div>
                  <div className='radio-single'>
                    <input
                      type='radio'
                      id='reviewFive'
                      name='donation-payment'
                    />
                    <label htmlFor='reviewFive'>
                      <span className='review'>
                        <i className='icon-star checked' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </span>
                      (1 Star)
                    </label>
                  </div>
                </div>
              </div>
              <div
                className='shop-sidebar-widget'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={100}
              >
                <div className='intro'>
                  <h5>Popular Tags</h5>
                </div>
                <div className='tag-wrapper'>
                  <Link href='/shop'>t-shirt</Link>
                  <Link href='/shop'>Banner Design</Link>
                  <Link href='/shop'>Brochures</Link>
                  <Link href='/shop'>Landing</Link>
                  <Link href='/shop'>Print</Link>
                  <Link href='/shop'>Business Card</Link>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-xl-9'>
            <div className='shop__content'>
              <div className='shop__content-intro'>
                <div className='shop-intro__left'>
                  <p>
                    Showing <strong>12</strong> of 21 Results
                  </p>
                </div>
                <div className='shop-intro__right'>
                  <div className='shop-right-single'>
                    <p>Sort By:</p>
                  </div>
                  <div className='shop-right-single'>
                    <button aria-label='sort by time' title='sort by time'>
                      <i className='fa-solid fa-arrow-right-arrow-left' />
                    </button>
                    <select
                      name='price'
                      ref={priceRef}
                      defaultValue={"high"}
                      className='price-select select'
                    >
                      <option value='high'>High</option>
                      <option value='low'>Low</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className='row gutter-30'>
                <div className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='shop__single'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                  >
                    <div className='shop__single-thumb'>
                      <Link href='/product-details'>
                        <img
                          src='assets/images/shop/one.png'
                          alt='Image_inner'
                        />
                      </Link>
                      <div className='shop-thumb'>
                        <Link href='/product-details'>
                          <i className='fa-regular fa-eye' />
                        </Link>
                        <Link href='/cart'>
                          <i className='icon-heart' />
                        </Link>
                        <Link href='/checkout'>
                          <i className='fa-solid fa-arrow-right-arrow-left' />
                        </Link>
                      </div>
                      <Link
                        href='/product-details'
                        className='btn--primary'
                        aria-label='add to cart'
                        title='add to cart'
                      >
                        Add To Cart
                      </Link>
                    </div>
                    <div className='shop__single-content'>
                      <div className='review'>
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </div>
                      <p>
                        <Link href='/product-details'>
                          Smart wireless headphone
                        </Link>
                      </p>
                      <p>$112.00</p>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='shop__single'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                    data-aos-delay={100}
                  >
                    <div className='shop__single-thumb'>
                      <Link href='/product-details'>
                        <img
                          src='assets/images/shop/two.png'
                          alt='Image_inner'
                        />
                      </Link>
                      <div className='shop-thumb'>
                        <Link href='/product-details'>
                          <i className='fa-regular fa-eye' />
                        </Link>
                        <Link href='/cart'>
                          <i className='icon-heart' />
                        </Link>
                        <Link href='/checkout'>
                          <i className='fa-solid fa-arrow-right-arrow-left' />
                        </Link>
                      </div>
                      <Link
                        href='/product-details'
                        className='btn--primary'
                        aria-label='add to cart'
                        title='add to cart'
                      >
                        Add To Cart
                      </Link>
                    </div>
                    <div className='shop__single-content'>
                      <div className='review'>
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </div>
                      <p>
                        <Link href='/product-details'>Go pro hero camera</Link>
                      </p>
                      <p>$160.00</p>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='shop__single'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                    data-aos-delay={200}
                  >
                    <div className='shop__single-thumb'>
                      <Link href='/product-details'>
                        <img
                          src='assets/images/shop/four.png'
                          alt='Image_inner'
                        />
                      </Link>
                      <div className='shop-thumb'>
                        <Link href='/product-details'>
                          <i className='fa-regular fa-eye' />
                        </Link>
                        <Link href='/cart'>
                          <i className='icon-heart' />
                        </Link>
                        <Link href='/checkout'>
                          <i className='fa-solid fa-arrow-right-arrow-left' />
                        </Link>
                      </div>
                      <Link
                        href='/product-details'
                        className='btn--primary'
                        aria-label='add to cart'
                        title='add to cart'
                      >
                        Add To Cart
                      </Link>
                    </div>
                    <div className='shop__single-content'>
                      <div className='review'>
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </div>
                      <p>
                        <Link href='/product-details'>Colorful apple Ipad</Link>
                      </p>
                      <p>$178.00</p>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='shop__single'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                  >
                    <div className='shop__single-thumb'>
                      <Link href='/product-details'>
                        <img
                          src='assets/images/shop/four.png'
                          alt='Image_inner'
                        />
                      </Link>
                      <div className='shop-thumb'>
                        <Link href='/product-details'>
                          <i className='fa-regular fa-eye' />
                        </Link>
                        <Link href='/cart'>
                          <i className='icon-heart' />
                        </Link>
                        <Link href='/checkout'>
                          <i className='fa-solid fa-arrow-right-arrow-left' />
                        </Link>
                      </div>
                      <Link
                        href='/product-details'
                        className='btn--primary'
                        aria-label='add to cart'
                        title='add to cart'
                      >
                        Add To Cart
                      </Link>
                    </div>
                    <div className='shop__single-content'>
                      <div className='review'>
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </div>
                      <p>
                        <Link href='/product-details'>
                          Humidifiler white grow
                        </Link>
                      </p>
                      <p>$190.00</p>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='shop__single'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                    data-aos-delay={100}
                  >
                    <div className='shop__single-thumb'>
                      <Link href='/product-details'>
                        <img
                          src='assets/images/shop/five.png'
                          alt='Image_inner'
                        />
                      </Link>
                      <div className='shop-thumb'>
                        <Link href='/product-details'>
                          <i className='fa-regular fa-eye' />
                        </Link>
                        <Link href='/cart'>
                          <i className='icon-heart' />
                        </Link>
                        <Link href='/checkout'>
                          <i className='fa-solid fa-arrow-right-arrow-left' />
                        </Link>
                      </div>
                      <Link
                        href='/product-details'
                        className='btn--primary'
                        aria-label='add to cart'
                        title='add to cart'
                      >
                        Add To Cart
                      </Link>
                    </div>
                    <div className='shop__single-content'>
                      <div className='review'>
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </div>
                      <p>
                        <Link href='/product-details'>
                          Apple Iphone 16 promax
                        </Link>
                      </p>
                      <p>$160.00</p>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='shop__single'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                    data-aos-delay={200}
                  >
                    <div className='shop__single-thumb'>
                      <Link href='/product-details'>
                        <img
                          src='assets/images/shop/six.png'
                          alt='Image_inner'
                        />
                      </Link>
                      <div className='shop-thumb'>
                        <Link href='/product-details'>
                          <i className='fa-regular fa-eye' />
                        </Link>
                        <Link href='/cart'>
                          <i className='icon-heart' />
                        </Link>
                        <Link href='/checkout'>
                          <i className='fa-solid fa-arrow-right-arrow-left' />
                        </Link>
                      </div>
                      <Link
                        href='/product-details'
                        className='btn--primary'
                        aria-label='add to cart'
                        title='add to cart'
                      >
                        Add To Cart
                      </Link>
                    </div>
                    <div className='shop__single-content'>
                      <div className='review'>
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </div>
                      <p>
                        <Link href='/product-details'>
                          Instax pro camera hero
                        </Link>
                      </p>
                      <p>$178.00</p>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='shop__single'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                  >
                    <div className='shop__single-thumb'>
                      <Link href='/product-details'>
                        <img
                          src='assets/images/shop/seven.png'
                          alt='Image_inner'
                        />
                      </Link>
                      <div className='shop-thumb'>
                        <Link href='/product-details'>
                          <i className='fa-regular fa-eye' />
                        </Link>
                        <Link href='/cart'>
                          <i className='icon-heart' />
                        </Link>
                        <Link href='/checkout'>
                          <i className='fa-solid fa-arrow-right-arrow-left' />
                        </Link>
                      </div>
                      <Link
                        href='/product-details'
                        className='btn--primary'
                        aria-label='add to cart'
                        title='add to cart'
                      >
                        Add To Cart
                      </Link>
                    </div>
                    <div className='shop__single-content'>
                      <div className='review'>
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </div>
                      <p>
                        <Link href='/product-details'>
                          VISION RAC Micro Oven
                        </Link>
                      </p>
                      <p>$162.00</p>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='shop__single'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                    data-aos-delay={100}
                  >
                    <div className='shop__single-thumb'>
                      <Link href='/product-details'>
                        <img
                          src='assets/images/shop/eight.png'
                          alt='Image_inner'
                        />
                      </Link>
                      <div className='shop-thumb'>
                        <Link href='/product-details'>
                          <i className='fa-regular fa-eye' />
                        </Link>
                        <Link href='/cart'>
                          <i className='icon-heart' />
                        </Link>
                        <Link href='/checkout'>
                          <i className='fa-solid fa-arrow-right-arrow-left' />
                        </Link>
                      </div>
                      <Link
                        href='/product-details'
                        className='btn--primary'
                        aria-label='add to cart'
                        title='add to cart'
                      >
                        Add To Cart
                      </Link>
                    </div>
                    <div className='shop__single-content'>
                      <div className='review'>
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </div>
                      <p>
                        <Link href='/product-details'>
                          Logitech Mouse Havit
                        </Link>
                      </p>
                      <p>$260.00</p>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='shop__single'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                    data-aos-delay={200}
                  >
                    <div className='shop__single-thumb'>
                      <Link href='/product-details'>
                        <img
                          src='assets/images/shop/nine.png'
                          alt='Image_inner'
                        />
                      </Link>
                      <div className='shop-thumb'>
                        <Link href='/product-details'>
                          <i className='fa-regular fa-eye' />
                        </Link>
                        <Link href='/cart'>
                          <i className='icon-heart' />
                        </Link>
                        <Link href='/checkout'>
                          <i className='fa-solid fa-arrow-right-arrow-left' />
                        </Link>
                      </div>
                      <Link
                        href='/product-details'
                        className='btn--primary'
                        aria-label='add to cart'
                        title='add to cart'
                      >
                        Add To Cart
                      </Link>
                    </div>
                    <div className='shop__single-content'>
                      <div className='review'>
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </div>
                      <p>
                        <Link href='/product-details'>
                          Macbook m1 cheap pro
                        </Link>
                      </p>
                      <p>$178.00</p>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='shop__single'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                  >
                    <div className='shop__single-thumb'>
                      <Link href='/product-details'>
                        <img
                          src='assets/images/shop/one.png'
                          alt='Image_inner'
                        />
                      </Link>
                      <div className='shop-thumb'>
                        <Link href='/product-details'>
                          <i className='fa-regular fa-eye' />
                        </Link>
                        <Link href='/cart'>
                          <i className='icon-heart' />
                        </Link>
                        <Link href='/checkout'>
                          <i className='fa-solid fa-arrow-right-arrow-left' />
                        </Link>
                      </div>
                      <Link
                        href='/product-details'
                        className='btn--primary'
                        aria-label='add to cart'
                        title='add to cart'
                      >
                        Add To Cart
                      </Link>
                    </div>
                    <div className='shop__single-content'>
                      <div className='review'>
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </div>
                      <p>
                        <Link href='/product-details'>
                          Smart wireless headphone
                        </Link>
                      </p>
                      <p>$112.00</p>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='shop__single'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                    data-aos-delay={100}
                  >
                    <div className='shop__single-thumb'>
                      <Link href='/product-details'>
                        <img
                          src='assets/images/shop/two.png'
                          alt='Image_inner'
                        />
                      </Link>
                      <div className='shop-thumb'>
                        <Link href='/product-details'>
                          <i className='fa-regular fa-eye' />
                        </Link>
                        <Link href='/cart'>
                          <i className='icon-heart' />
                        </Link>
                        <Link href='/checkout'>
                          <i className='fa-solid fa-arrow-right-arrow-left' />
                        </Link>
                      </div>
                      <Link
                        href='/product-details'
                        className='btn--primary'
                        aria-label='add to cart'
                        title='add to cart'
                      >
                        Add To Cart
                      </Link>
                    </div>
                    <div className='shop__single-content'>
                      <div className='review'>
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </div>
                      <p>
                        <Link href='/product-details'>Go pro hero camera</Link>
                      </p>
                      <p>$160.00</p>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='shop__single'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                    data-aos-delay={200}
                  >
                    <div className='shop__single-thumb'>
                      <Link href='/product-details'>
                        <img
                          src='assets/images/shop/four.png'
                          alt='Image_inner'
                        />
                      </Link>
                      <div className='shop-thumb'>
                        <Link href='/product-details'>
                          <i className='fa-regular fa-eye' />
                        </Link>
                        <Link href='/cart'>
                          <i className='icon-heart' />
                        </Link>
                        <Link href='/checkout'>
                          <i className='fa-solid fa-arrow-right-arrow-left' />
                        </Link>
                      </div>
                      <Link
                        href='/product-details'
                        className='btn--primary'
                        aria-label='add to cart'
                        title='add to cart'
                      >
                        Add To Cart
                      </Link>
                    </div>
                    <div className='shop__single-content'>
                      <div className='review'>
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                        <i className='icon-star' />
                      </div>
                      <p>
                        <Link href='/product-details'>Colorful apple Ipad</Link>
                      </p>
                      <p>$178.00</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
                  <div
                    className='pagination-wrapper'
                    data-aos='fade-up'
                    data-aos-duration={1000}
                  >
                    <ul className='pagination main-pagination'>
                      <li>
                        <button>
                          <i className='fa-solid fa-angles-left' />
                        </button>
                      </li>
                      <li>
                        <Link href='/blog-list'>1</Link>
                      </li>
                      <li>
                        <Link href='/blog-list' className='active'>
                          2
                        </Link>
                      </li>
                      <li>
                        <Link href='/blog-list'>3</Link>
                      </li>
                      <li>
                        <button>
                          <i className='fa-solid fa-angles-right' />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopInner;
