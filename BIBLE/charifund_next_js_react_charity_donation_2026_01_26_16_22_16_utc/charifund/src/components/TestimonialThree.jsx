"use client";
import { useRef } from "react";
import Slider from "react-slick";

const TestimonialThree = () => {
  const sliderRef = useRef(null);
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: true,
    dots: false,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 0,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className='testimonial-three'>
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
                What Our <span>Clients</span> Say About Our Volunteers
              </h2>
            </div>
          </div>
        </div>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10 col-xl-9 col-xxl-12'>
            <div className='testimonial-three__inner'>
              <div className='testimonial-three__slider swiper'>
                <Slider
                  {...settings}
                  ref={sliderRef}
                  className='swiper-wrapper'
                >
                  <div className='swiper-slide'>
                    <div className='testimonial-three__single'>
                      <div className='thumb'>
                        <img
                          src='/assets/images/author-three.png'
                          alt='Image_inner'
                        />
                        <div className='review'>
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                        </div>
                      </div>
                      <div className='testimonial-three__content'>
                        <div className='author-info'>
                          <div className='author-content'>
                            <h6>Charlie Dublin</h6>
                            <p>Global Partner</p>
                          </div>
                          <div className='quote'>
                            <i className='icon-quotation-two' />
                          </div>
                        </div>
                        <p>
                          Foundation was established with a small idea that was
                          incepted in the minds of its promoters in the year
                          1994! We skilfully guide applicants for immigration
                          process to any country they aspire to settle down
                          immigration advisory
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='swiper-slide'>
                    <div className='testimonial-three__single'>
                      <div className='thumb'>
                        <img
                          src='/assets/images/author-four.png'
                          alt='Image_inner'
                        />
                        <div className='review'>
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                        </div>
                      </div>
                      <div className='testimonial-three__content'>
                        <div className='author-info'>
                          <div className='author-content'>
                            <h6>Lablu Kuel</h6>
                            <p>Global Partner</p>
                          </div>
                          <div className='quote'>
                            <i className='icon-quotation-two' />
                          </div>
                        </div>
                        <p>
                          Foundation was established with a small idea that was
                          incepted in the minds of its promoters in the year
                          1994! We skilfully guide applicants for immigration
                          process to any country they aspire to settle down
                          immigration advisory
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='swiper-slide'>
                    <div className='testimonial-three__single'>
                      <div className='thumb'>
                        <img
                          src='/assets/images/author-three.png'
                          alt='Image_inner'
                        />
                        <div className='review'>
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                        </div>
                      </div>
                      <div className='testimonial-three__content'>
                        <div className='author-info'>
                          <div className='author-content'>
                            <h6>Charlie Dublin</h6>
                            <p>Global Partner</p>
                          </div>
                          <div className='quote'>
                            <i className='icon-quotation-two' />
                          </div>
                        </div>
                        <p>
                          Foundation was established with a small idea that was
                          incepted in the minds of its promoters in the year
                          1994! We skilfully guide applicants for immigration
                          process to any country they aspire to settle down
                          immigration advisory
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='swiper-slide'>
                    <div className='testimonial-three__single'>
                      <div className='thumb'>
                        <img
                          src='/assets/images/author-four.png'
                          alt='Image_inner'
                        />
                        <div className='review'>
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                          <i className='icon-star' />
                        </div>
                      </div>
                      <div className='testimonial-three__content'>
                        <div className='author-info'>
                          <div className='author-content'>
                            <h6>Lablu Kuel</h6>
                            <p>Global Partner</p>
                          </div>
                          <div className='quote'>
                            <i className='icon-quotation-two' />
                          </div>
                        </div>
                        <p>
                          Foundation was established with a small idea that was
                          incepted in the minds of its promoters in the year
                          1994! We skilfully guide applicants for immigration
                          process to any country they aspire to settle down
                          immigration advisory
                        </p>
                      </div>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <div className='slider-navigation'>
              <button
                type='button'
                onClick={() => sliderRef.current.slickPrev()}
                aria-label='prev slide'
                title='prev slide'
                className='prev-testimonial-three slider-btn'
              >
                <i className='fa-solid fa-arrow-left' />
              </button>
              <button
                type='button'
                onClick={() => sliderRef.current.slickNext()}
                aria-label='next slide'
                title='next slide'
                className='next-testimonial-three slider-btn slider-btn-next'
              >
                <i className='fa-solid fa-arrow-right' />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='spade'>
        <img
          src='/assets/images/community/spade.png'
          alt='Image_inner'
          className='base-img'
        />
      </div>
      <div className='spade-green'>
        <img src='/assets/images/sprade-green.png' alt='Image_inner' />
      </div>
    </section>
  );
};

export default TestimonialThree;
