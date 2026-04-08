"use client";
import Link from "next/link";
import { useRef } from "react";
import Slider from "react-slick";

const BannerTwo = () => {
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
    <section className='banner'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-xl-10'>
            <div className='banner__slider swiper'>
              <Slider {...settings} ref={sliderRef} className='swiper-wrapper'>
                <div className='swiper-slide'>
                  <div className='banner__content text-center'>
                    <span className='sub-title'>
                      <i className='icon-donation' />
                      Start donating poor people
                    </span>
                    <h1>
                      Helping Each Other Make
                      <span>Better</span> today
                    </h1>
                    <p>
                      Join our monthly giving program to provide consistent
                      support to our initiatives. Regular contributions, no
                      matter the size, help us plan and sustain long-term
                      projects.
                    </p>
                    <div className='banner__content-cta cta'>
                      <Link
                        href='/our-causes'
                        aria-label='about us'
                        title='about us'
                        className='btn--tertiary'
                      >
                        Discover More <i className='fa-solid fa-arrow-right' />
                      </Link>
                      <Link
                        href='/contact-us'
                        aria-label='contact us'
                        title='contact us'
                        className='btn--primary'
                      >
                        Get A Quote <i className='fa-solid fa-arrow-right' />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='banner__content text-center'>
                    <span className='sub-title'>
                      <i className='icon-donation' />
                      Start donating poor people
                    </span>
                    <h1>
                      Helping Each Other Make
                      <span>Better</span> today
                    </h1>
                    <p>
                      Join our monthly giving program to provide consistent
                      support to our initiatives. Regular contributions, no
                      matter the size, help us plan and sustain long-term
                      projects.
                    </p>
                    <div className='banner__content-cta cta'>
                      <Link
                        href='/our-causes'
                        aria-label='about us'
                        title='about us'
                        className='btn--tertiary'
                      >
                        Discover More <i className='fa-solid fa-arrow-right' />
                      </Link>
                      <Link
                        href='/contact-us'
                        aria-label='contact us'
                        title='contact us'
                        className='btn--primary'
                      >
                        Get A Quote <i className='fa-solid fa-arrow-right' />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='banner__content text-center'>
                    <span className='sub-title'>
                      <i className='icon-donation' />
                      Start donating poor people
                    </span>
                    <h1>
                      Helping Each Other Make
                      <span>Better</span> today
                    </h1>
                    <p>
                      Join our monthly giving program to provide consistent
                      support to our initiatives. Regular contributions, no
                      matter the size, help us plan and sustain long-term
                      projects.
                    </p>
                    <div className='banner__content-cta cta'>
                      <Link
                        href='/our-causes'
                        aria-label='about us'
                        title='about us'
                        className='btn--tertiary'
                      >
                        Discover More <i className='fa-solid fa-arrow-right' />
                      </Link>
                      <Link
                        href='/contact-us'
                        aria-label='contact us'
                        title='contact us'
                        className='btn--primary'
                      >
                        Get A Quote <i className='fa-solid fa-arrow-right' />
                      </Link>
                    </div>
                  </div>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>
      <div className='banner-bg'>
        <img
          src='/assets/images/banner/banner-one-bg.png'
          alt='Image_inner'
          className='parallax-image'
        />
      </div>
      <div className='bottom-shape'>
        <img
          src='/assets/images/banner/banner-one-shape.png'
          alt='Image_inner'
        />
      </div>
      <div
        className='alter-shape'
        data-aos='zoom-in'
        data-aos-duration={1000}
        data-aos-delay={300}
      />
      <div className='circle-shape' />
    </section>
  );
};

export default BannerTwo;
