"use client";
import { useRef } from "react";
import Slider from "react-slick";

const TestimonialTwo = () => {
  const sliderRef = useRef(null);
  const settings = {
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <section className='testimonial-two'>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-lg-9 col-xl-5'>
            <div
              className='section__header'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={100}
            >
              <span className='sub-title'>
                <i className='icon-donation' />
                Start donating poor people
              </span>
              <h2 className='title-animation_inner'>
                What People Say
                <span>About</span> us
              </h2>
            </div>
          </div>
        </div>
        <div className='row'>
          <div
            className='testimonial-two__inner'
            style={{
              backgroundImage: "url(/assets/images/testimonial-bg.png)",
            }}
            data-aos='fade-up'
            data-aos-duration={1000}
            data-aos-delay={100}
          >
            <div className='row align-items-center'>
              <div className='col-12 col-lg-5 d-none d-lg-block'>
                <div className='testimonial-two__thumb'>
                  <img
                    src='/assets/images/testimonial-thumb.png'
                    alt='Image_inner'
                  />
                  <div className='quote-thumb'>
                    <i className='fa-solid fa-quote-right' />
                  </div>
                </div>
              </div>
              <div className='col-12 col-lg-7 col-xl-6'>
                <div className='testimonial-two__content'>
                  <div className='testimonial-two__slider swiper'>
                    <Slider
                      {...settings}
                      ref={sliderRef}
                      className='swiper-wrapper'
                    >
                      <div className='swiper-slide'>
                        <div className='testimonial-two__single'>
                          <div className='author-info'>
                            <div className='author-thumb'>
                              <img
                                src='/assets/images/author-two.png'
                                alt='Image_inner'
                              />
                            </div>
                            <div className='author-content'>
                              <h5>James Anderson</h5>
                              <p>Software Engineer</p>
                            </div>
                          </div>
                          <div className='testimonial-two__single-content'>
                            <h5>
                              Climb the mountain not to plant your flag but to
                              embrace the ways challenge, enjoy the air, and
                              behold the. Climb it see the world, not so the
                              world can see you. This is due to their excellent
                              service.
                            </h5>
                            <div className='review'>
                              <i className='icon-star' />
                              <i className='icon-star' />
                              <i className='icon-star' />
                              <i className='icon-star' />
                              <i className='icon-star' />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='swiper-slide'>
                        <div className='testimonial-two__single'>
                          <div className='author-info'>
                            <div className='author-thumb'>
                              <img
                                src='/assets/images/author-two.png'
                                alt='Image_inner'
                              />
                            </div>
                            <div className='author-content'>
                              <h5>James Anderson</h5>
                              <p>Software Engineer</p>
                            </div>
                          </div>
                          <div className='testimonial-two__single-content'>
                            <h5>
                              Climb the mountain not to plant your flag but to
                              embrace the ways challenge, enjoy the air, and
                              behold the. Climb it see the world, not so the
                              world can see you. This is due to their excellent
                              service.
                            </h5>
                            <div className='review'>
                              <i className='icon-star' />
                              <i className='icon-star' />
                              <i className='icon-star' />
                              <i className='icon-star' />
                              <i className='icon-star' />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='swiper-slide'>
                        <div className='testimonial-two__single'>
                          <div className='author-info'>
                            <div className='author-thumb'>
                              <img
                                src='/assets/images/author-two.png'
                                alt='Image_inner'
                              />
                            </div>
                            <div className='author-content'>
                              <h5>James Anderson</h5>
                              <p>Software Engineer</p>
                            </div>
                          </div>
                          <div className='testimonial-two__single-content'>
                            <h5>
                              Climb the mountain not to plant your flag but to
                              embrace the ways challenge, enjoy the air, and
                              behold the. Climb it see the world, not so the
                              world can see you. This is due to their excellent
                              service.
                            </h5>
                            <div className='review'>
                              <i className='icon-star' />
                              <i className='icon-star' />
                              <i className='icon-star' />
                              <i className='icon-star' />
                              <i className='icon-star' />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Slider>
                  </div>
                  <div className='slider-navigation cta'>
                    <button
                      type='button'
                      onClick={() => sliderRef.current.slickPrev()}
                      aria-label='prev slide'
                      title='prev slide'
                      className='prev-testimonial-two slider-btn'
                    >
                      <i className='fa-solid fa-arrow-left' />
                    </button>
                    <button
                      type='button'
                      onClick={() => sliderRef.current.slickNext()}
                      aria-label='next slide'
                      title='next slide'
                      className='next-testimonial-two slider-btn slider-btn-next'
                    >
                      <i className='fa-solid fa-arrow-right' />
                    </button>
                  </div>
                  <div className='quote'>
                    <img src='/assets/images/quote-two.png' alt='Image_inner' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='blog-bg'>
        <img src='/assets/images/blog/blog-bg.png' alt='Image_inner' />
      </div>
      <div className='spade'>
        <img
          src='/assets/images/community/spade.png'
          alt='Image_inner'
          className='base-img'
        />
      </div>
    </section>
  );
};

export default TestimonialTwo;
