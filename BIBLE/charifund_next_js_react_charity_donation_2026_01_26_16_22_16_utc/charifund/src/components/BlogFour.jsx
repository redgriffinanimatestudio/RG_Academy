"use client";
import Link from "next/link";
import { useRef } from "react";
import Slider from "react-slick";

const BlogFour = () => {
  const sliderRef = useRef(null);
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToScroll: 1,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "0%",
    arrows: false,
    dots: true,
    appendDots: (dots) => <div className='ff-pagination'>{dots}</div>,
    customPaging: () => <button className='dot' />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          centerPadding: "5%",
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          centerPadding: "5%",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "5%",
        },
      },
    ],
  };
  return (
    <section className='blog ff-blog four'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <span className='sub-title'>We are always open for children</span>
              <h2 className='title-animation_inner mt-0 fw-7'>
                our latest article news &amp; blogs you need
              </h2>
            </div>
          </div>
        </div>
        <div className='row gutter-40'>
          <div className='col-12'>
            <div className='ff-blog-slider swiper'>
              <Slider {...settings} ref={sliderRef} className='swiper-wrapper'>
                <div className='swiper-slide'>
                  <div className='blog__single-wrapper'>
                    <div className='blog__single'>
                      <div className='blog__single-thumb'>
                        <Link href='/blog-details'>
                          <img
                            src='assets/images/blog/one.png'
                            alt='Image_inner'
                          />
                        </Link>
                      </div>
                      <div className='blog__single-inner'>
                        <div className='blog__single-meta mb-0'>
                          <p>
                            <i className='icon-user' />
                            Robert Fox
                          </p>
                          <p>
                            <i className='icon-message' />
                            Comments (03)
                          </p>
                        </div>
                        <div className='blog__single-content'>
                          <h6>
                            <Link href='/blog-details'>
                              Complete Guide to Business Insurance perfect
                            </Link>
                          </h6>
                        </div>
                        <div className='blog__single-cta'>
                          <Link
                            href='/blog-details'
                            aria-label='blog details'
                            title='blog details'
                          >
                            Read More
                            <i className='fa-solid fa-circle-arrow-right' />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='blog__single-wrapper'>
                    <div className='blog__single'>
                      <div className='blog__single-thumb'>
                        <Link href='/blog-details'>
                          <img
                            src='assets/images/blog/two.png'
                            alt='Image_inner'
                          />
                        </Link>
                      </div>
                      <div className='blog__single-inner'>
                        <div className='blog__single-meta mb-0'>
                          <p>
                            <i className='icon-user' />
                            Robert Fox
                          </p>
                          <p>
                            <i className='icon-message' />
                            Comments (03)
                          </p>
                        </div>
                        <div className='blog__single-content'>
                          <h6>
                            <Link href='/blog-details'>
                              Complete Guide to Business Insurance perfect
                            </Link>
                          </h6>
                        </div>
                        <div className='blog__single-cta'>
                          <Link
                            href='/blog-details'
                            aria-label='blog details'
                            title='blog details'
                          >
                            Read More
                            <i className='fa-solid fa-circle-arrow-right' />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='blog__single-wrapper'>
                    <div className='blog__single'>
                      <div className='blog__single-thumb'>
                        <Link href='/blog-details'>
                          <img
                            src='assets/images/blog/three.png'
                            alt='Image_inner'
                          />
                        </Link>
                      </div>
                      <div className='blog__single-inner'>
                        <div className='blog__single-meta mb-0'>
                          <p>
                            <i className='icon-user' />
                            Robert Fox
                          </p>
                          <p>
                            <i className='icon-message' />
                            Comments (03)
                          </p>
                        </div>
                        <div className='blog__single-content'>
                          <h6>
                            <Link href='/blog-details'>
                              Complete Guide to Business Insurance perfect
                            </Link>
                          </h6>
                        </div>
                        <div className='blog__single-cta'>
                          <Link
                            href='/blog-details'
                            aria-label='blog details'
                            title='blog details'
                          >
                            Read More
                            <i className='fa-solid fa-circle-arrow-right' />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='blog__single-wrapper'>
                    <div className='blog__single'>
                      <div className='blog__single-thumb'>
                        <Link href='/blog-details'>
                          <img
                            src='assets/images/blog/one.png'
                            alt='Image_inner'
                          />
                        </Link>
                      </div>
                      <div className='blog__single-inner'>
                        <div className='blog__single-meta mb-0'>
                          <p>
                            <i className='icon-user' />
                            Robert Fox
                          </p>
                          <p>
                            <i className='icon-message' />
                            Comments (03)
                          </p>
                        </div>
                        <div className='blog__single-content'>
                          <h6>
                            <Link href='/blog-details'>
                              Complete Guide to Business Insurance perfect
                            </Link>
                          </h6>
                        </div>
                        <div className='blog__single-cta'>
                          <Link
                            href='/blog-details'
                            aria-label='blog details'
                            title='blog details'
                          >
                            Read More
                            <i className='fa-solid fa-circle-arrow-right' />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='blog__single-wrapper'>
                    <div className='blog__single'>
                      <div className='blog__single-thumb'>
                        <Link href='/blog-details'>
                          <img
                            src='assets/images/blog/two.png'
                            alt='Image_inner'
                          />
                        </Link>
                      </div>
                      <div className='blog__single-inner'>
                        <div className='blog__single-meta mb-0'>
                          <p>
                            <i className='icon-user' />
                            Robert Fox
                          </p>
                          <p>
                            <i className='icon-message' />
                            Comments (03)
                          </p>
                        </div>
                        <div className='blog__single-content'>
                          <h6>
                            <Link href='/blog-details'>
                              Complete Guide to Business Insurance perfect
                            </Link>
                          </h6>
                        </div>
                        <div className='blog__single-cta'>
                          <Link
                            href='/blog-details'
                            aria-label='blog details'
                            title='blog details'
                          >
                            Read More
                            <i className='fa-solid fa-circle-arrow-right' />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='blog__single-wrapper'>
                    <div className='blog__single'>
                      <div className='blog__single-thumb'>
                        <Link href='/blog-details'>
                          <img
                            src='assets/images/blog/three.png'
                            alt='Image_inner'
                          />
                        </Link>
                      </div>
                      <div className='blog__single-inner'>
                        <div className='blog__single-meta mb-0'>
                          <p>
                            <i className='icon-user' />
                            Robert Fox
                          </p>
                          <p>
                            <i className='icon-message' />
                            Comments (03)
                          </p>
                        </div>
                        <div className='blog__single-content'>
                          <h6>
                            <Link href='/blog-details'>
                              Complete Guide to Business Insurance perfect
                            </Link>
                          </h6>
                        </div>
                        <div className='blog__single-cta'>
                          <Link
                            href='/blog-details'
                            aria-label='blog details'
                            title='blog details'
                          >
                            Read More
                            <i className='fa-solid fa-circle-arrow-right' />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <div className='ff-pagination pagination-one mt-40' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogFour;
