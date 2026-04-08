"use client";

import { useRef } from "react";
import Slider from "react-slick";

const TestimonialOne = () => {
  const sliderRef = useRef(null);

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,

    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <section
        className='testimonial'
        style={{
          backgroundImage: "url(/assets/images/bg-one.png)",
        }}
      >
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-md-8 col-xl-7'>
              <div
                className='section__header text-center'
                data-aos='fade-up'
                data-aos-duration={1000}
              >
                <span className='sub-title'>
                  <i className='icon-donation' />
                  Start donating poor people
                </span>
                <h2 className='title-animation_inner'>
                  Our valueable <span>customer</span>
                  Awesome Feedback
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className='testimonial__inner'>
          <div className='container'>
            <div className='row'>
              <div className='col-12'>
                <div className='testimonial__slider swiper'>
                  <Slider
                    {...settings}
                    ref={sliderRef}
                    className='swiper-wrapper'
                  >
                    <div className='swiper-slide'>
                      <div className='testimonial__slider-single'>
                        <div className='review'>
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                        </div>
                        <div className='content'>
                          <blockquote>
                            <q>
                              Charity is the voluntary act of giving help,
                              typically in the form of money, time, or
                              resources, to those in need. Charitable
                              organizations aim to solve social, environmental,
                              and economic challenges by addressing issues like
                              poverty
                            </q>
                          </blockquote>
                        </div>
                        <div className='author-info'>
                          <div className='author-thumb'>
                            <img
                              src='assets/images/author.png'
                              alt='Image_inner'
                            />
                          </div>
                          <div className='author-content'>
                            <h6>Michel Smith</h6>
                            <p>Cloth Store Inc.</p>
                          </div>
                        </div>
                        <div className='quote'>
                          <img
                            src='assets/images/quote.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide'>
                      <div className='testimonial__slider-single'>
                        <div className='review'>
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                        </div>
                        <div className='content'>
                          <blockquote>
                            <q>
                              Charity is the voluntary act of giving help,
                              typically in the form of money, time, or
                              resources, to those in need. Charitable
                              organizations aim to solve social, environmental,
                              and economic challenges by addressing issues like
                              poverty
                            </q>
                          </blockquote>
                        </div>
                        <div className='author-info'>
                          <div className='author-thumb'>
                            <img
                              src='assets/images/author.png'
                              alt='Image_inner'
                            />
                          </div>
                          <div className='author-content'>
                            <h6>Ruby Klara</h6>
                            <p>Cloth Store Inc.</p>
                          </div>
                        </div>
                        <div className='quote'>
                          <img
                            src='assets/images/quote.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide'>
                      <div className='testimonial__slider-single'>
                        <div className='review'>
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                        </div>
                        <div className='content'>
                          <blockquote>
                            <q>
                              Charity is the voluntary act of giving help,
                              typically in the form of money, time, or
                              resources, to those in need. Charitable
                              organizations aim to solve social, environmental,
                              and economic challenges by addressing issues like
                              poverty
                            </q>
                          </blockquote>
                        </div>
                        <div className='author-info'>
                          <div className='author-thumb'>
                            <img
                              src='assets/images/author.png'
                              alt='Image_inner'
                            />
                          </div>
                          <div className='author-content'>
                            <h6>Bishu Kiev</h6>
                            <p>Cloth Store Inc.</p>
                          </div>
                        </div>
                        <div className='quote'>
                          <img
                            src='assets/images/quote.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide'>
                      <div className='testimonial__slider-single'>
                        <div className='review'>
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                        </div>
                        <div className='content'>
                          <blockquote>
                            <q>
                              Charity is the voluntary act of giving help,
                              typically in the form of money, time, or
                              resources, to those in need. Charitable
                              organizations aim to solve social, environmental,
                              and economic challenges by addressing issues like
                              poverty
                            </q>
                          </blockquote>
                        </div>
                        <div className='author-info'>
                          <div className='author-thumb'>
                            <img
                              src='assets/images/author.png'
                              alt='Image_inner'
                            />
                          </div>
                          <div className='author-content'>
                            <h6>Michel Smith</h6>
                            <p>Cloth Store Inc.</p>
                          </div>
                        </div>
                        <div className='quote'>
                          <img
                            src='assets/images/quote.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide'>
                      <div className='testimonial__slider-single'>
                        <div className='review'>
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                        </div>
                        <div className='content'>
                          <blockquote>
                            <q>
                              Charity is the voluntary act of giving help,
                              typically in the form of money, time, or
                              resources, to those in need. Charitable
                              organizations aim to solve social, environmental,
                              and economic challenges by addressing issues like
                              poverty
                            </q>
                          </blockquote>
                        </div>
                        <div className='author-info'>
                          <div className='author-thumb'>
                            <img
                              src='assets/images/author.png'
                              alt='Image_inner'
                            />
                          </div>
                          <div className='author-content'>
                            <h6>Ruby Klara</h6>
                            <p>Cloth Store Inc.</p>
                          </div>
                        </div>
                        <div className='quote'>
                          <img
                            src='assets/images/quote.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide'>
                      <div className='testimonial__slider-single'>
                        <div className='review'>
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                        </div>
                        <div className='content'>
                          <blockquote>
                            <q>
                              Charity is the voluntary act of giving help,
                              typically in the form of money, time, or
                              resources, to those in need. Charitable
                              organizations aim to solve social, environmental,
                              and economic challenges by addressing issues like
                              poverty
                            </q>
                          </blockquote>
                        </div>
                        <div className='author-info'>
                          <div className='author-thumb'>
                            <img
                              src='assets/images/author.png'
                              alt='Image_inner'
                            />
                          </div>
                          <div className='author-content'>
                            <h6>Bishu Kiev</h6>
                            <p>Cloth Store Inc.</p>
                          </div>
                        </div>
                        <div className='quote'>
                          <img
                            src='assets/images/quote.png'
                            alt='Image_inner'
                          />
                        </div>
                      </div>
                    </div>
                  </Slider>
                </div>
              </div>
            </div>
          </div>
          <div className='slider-navigation'>
            <button
              onClick={() => sliderRef.current.slickPrev()}
              type='button'
              aria-label='prev slide'
              title='prev slide'
              className='prev-testimonial slider-btn'
            >
              <i className='fa-solid fa-arrow-left' />
            </button>
            <button
              onClick={() => sliderRef.current.slickNext()}
              type='button'
              aria-label='next slide'
              title='next slide'
              className='next-testimonial slider-btn slider-btn-next'
            >
              <i className='fa-solid fa-arrow-right' />
            </button>
          </div>
        </div>
        <div
          className='shape'
          data-aos='fade-right'
          data-aos-duration={1000}
          data-aos-delay={200}
        >
          <img
            src='assets/images/community/shape.png'
            alt='Image_inner'
            className='base-img'
          />
        </div>
      </section>
    </>
  );
};

export default TestimonialOne;
