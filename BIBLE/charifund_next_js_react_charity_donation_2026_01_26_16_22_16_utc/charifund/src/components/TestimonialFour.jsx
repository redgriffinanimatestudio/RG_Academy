"use client";
import { useRef } from "react";
import Slider from "react-slick";

const TestimonialFour = () => {
  const sliderRef = useRef(null);
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px", // adjust to simulate depth
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false, // we'll use custom buttons below
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: "30px",
        },
      },
    ],
  };
  return (
    <section className='testimonial fc-testimonial pt-120 pb-120'>
      <div className='container'>
        <div className='row align-items-center'>
          <div className='col-12 col-xl-4'>
            <div className='fc-test__thumb d-none d-xl-block'>
              <img src='assets/images/test-thumb.png' alt='Image_inner' />
            </div>
          </div>
          <div className='col-12 col-xl-7 offset-xl-1'>
            <div className='fc-test__content'>
              <div className='fc-slider swiper'>
                <Slider
                  {...settings}
                  ref={sliderRef}
                  className='swiper-wrapper'
                >
                  <div className='swiper-slide'>
                    <div className='testimonial__slider-single'>
                      <div className='content'>
                        <p className='text-xl'>
                          Denouncing pleasure and praising pain was born and I
                          will give you a complete account of the system, and
                          expound the actual teachings of the great explorer of
                          truth the master
                        </p>
                      </div>
                      <div className='author-info'>
                        <div className='author-thumb'>
                          <img
                            src='assets/images/author-two.png'
                            alt='Image_inner'
                          />
                        </div>
                        <div className='author-content'>
                          <h6>Michel Smith</h6>
                          <p>
                            Founder of <span>Charifund</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='swiper-slide'>
                    <div className='testimonial__slider-single'>
                      <div className='content'>
                        <p className='text-xl'>
                          Denouncing pleasure and praising pain was born and I
                          will give you a complete account of the system, and
                          expound the actual teachings of the great explorer of
                          truth the master
                        </p>
                      </div>
                      <div className='author-info'>
                        <div className='author-thumb'>
                          <img
                            src='assets/images/author-two.png'
                            alt='Image_inner'
                          />
                        </div>
                        <div className='author-content'>
                          <h6>Michel Smith</h6>
                          <p>
                            Founder of <span>Charifund</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='swiper-slide'>
                    <div className='testimonial__slider-single'>
                      <div className='content'>
                        <p className='text-xl'>
                          Denouncing pleasure and praising pain was born and I
                          will give you a complete account of the system, and
                          expound the actual teachings of the great explorer of
                          truth the master
                        </p>
                      </div>
                      <div className='author-info'>
                        <div className='author-thumb'>
                          <img
                            src='assets/images/author-two.png'
                            alt='Image_inner'
                          />
                        </div>
                        <div className='author-content'>
                          <h6>Michel Smith</h6>
                          <p>
                            Founder of <span>Charifund</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Slider>
              </div>
              <div className='slider-navigation'>
                <button
                  type='button'
                  onClick={() => sliderRef.current.slickPrev()}
                  aria-label='prev slide'
                  title='prev slide'
                  className='prev-test slider-btn'
                >
                  <i className='fa-solid fa-arrow-left' />
                </button>
                <button
                  type='button'
                  onClick={() => sliderRef.current.slickNext()}
                  aria-label='next slide'
                  title='next slide'
                  className='next-test slider-btn slider-btn-next'
                >
                  <i className='fa-solid fa-arrow-right' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className='test-text'>Testimonial</span>
      <div className='feed'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={31}
          height={37}
          viewBox='0 0 31 37'
          fill='none'
        >
          <path
            d='M0 9.7657L0 32.2089C0 34.3788 1.76172 36.1348 3.92942 36.1348H16.1925C17.2803 36.1348 18.2607 35.6977 18.973 34.9846C19.6854 34.2792 20.122 33.2977 20.122 32.2089C20.122 31.9482 20.3518 31.7488 20.6199 31.7872L24.848 32.4466C25.2616 32.5156 25.5068 32.0249 25.2157 31.7335L20.2446 26.6499C20.1679 26.5655 20.122 26.4659 20.122 26.3508L20.122 9.7657C20.122 7.59574 18.3679 5.83219 16.1925 5.83219H3.92942C1.76172 5.83219 0 7.59574 0 9.7657ZM9.72777 27.1483L10.7848 28.2371C10.8767 28.3291 11.0146 28.3751 11.1448 28.3521L12.6385 28.0914C12.9602 28.0377 13.213 28.3828 13.0598 28.6742L12.3551 30.0236C12.2938 30.1387 12.2938 30.2767 12.3551 30.3917L13.0598 31.7488C13.213 32.0402 12.9678 32.3853 12.6385 32.3239L11.1448 32.0709C11.0146 32.0479 10.8844 32.0939 10.7925 32.1859L9.72777 33.2747C9.49032 33.5124 9.09205 33.3821 9.03842 33.0524L8.82393 31.5495C8.80864 31.4191 8.72435 31.3042 8.60948 31.2428L7.23837 30.568C6.93968 30.4224 6.93968 29.993 7.23837 29.8473L8.60948 29.1802C8.72435 29.1188 8.80864 29.0039 8.82393 28.8735L9.03842 27.3706C9.09205 27.0409 9.49032 26.9106 9.72777 27.1483ZM9.72777 17.9241L10.7848 19.0129C10.8767 19.1049 11.0146 19.1509 11.1448 19.1279L12.6385 18.8672C12.9602 18.8135 13.213 19.1509 13.0598 19.4499L12.3551 20.7995C12.2938 20.9144 12.2938 21.0525 12.3551 21.1675L13.0598 22.517C13.213 22.8161 12.9678 23.1534 12.6385 23.0998L11.1448 22.8467C11.0146 22.8237 10.8844 22.8697 10.7925 22.9617L9.72777 24.0505C9.49032 24.2882 9.09205 24.1579 9.03842 23.8282L8.82393 22.3253C8.80864 22.195 8.72435 22.0799 8.60948 22.0186L7.23837 21.3438C6.93968 21.1982 6.93968 20.7688 7.23837 20.6231L8.60948 19.956C8.72435 19.8947 8.80864 19.7796 8.82393 19.6493L9.03842 18.1464C9.09205 17.8167 9.49032 17.6864 9.72777 17.9241ZM9.72777 8.69988L10.7848 9.78872C10.8767 9.88073 11.0146 9.91906 11.1448 9.89603L12.6385 9.64303C12.9602 9.58168 13.213 9.92673 13.0598 10.2257L12.3551 11.5676C12.2938 11.6903 12.2938 11.8283 12.3551 11.9433L13.0598 13.2928C13.213 13.5842 12.9678 13.9292 12.6385 13.8755L11.1448 13.6225C11.0146 13.5995 10.8844 13.6455 10.7925 13.7375L9.72777 14.8263C9.49032 15.0641 9.09205 14.9337 9.03842 14.604L8.82393 13.0935C8.80864 12.9631 8.72435 12.8558 8.60948 12.7944L7.23837 12.1197C6.93968 11.9663 6.93968 11.5446 7.23837 11.3989L8.60948 10.7242C8.72435 10.6705 8.80864 10.5555 8.82393 10.4251L9.03842 8.92227C9.09205 8.59257 9.49032 8.46218 9.72777 8.69988Z'
            fill='white'
          />
          <path
            d='M9.07395 0.0969944H21.3448C22.4324 0.0969944 23.4129 0.541733 24.1253 1.24714C24.8299 1.96023 25.2665 2.94934 25.2665 4.0305C25.2665 4.29118 25.504 4.49055 25.7644 4.44454L29.9926 3.79281C30.4062 3.72378 30.6513 4.21452 30.3679 4.5059L25.3891 9.58955C25.3202 9.67389 25.2665 9.77357 25.2665 9.8886L25.2665 26.4737C25.2665 27.3478 24.9831 28.1529 24.5006 28.8047L21.6588 25.8986L21.6588 9.76589C21.6588 6.75251 19.2078 4.29885 16.1975 4.29885H5.14453V4.0305C5.14453 1.86055 6.89863 0.0969944 9.07395 0.0969944Z'
            fill='white'
          />
        </svg>
        <span>Feedback</span>
      </div>
    </section>
  );
};

export default TestimonialFour;
