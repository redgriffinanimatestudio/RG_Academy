"use client";
import Link from "next/link";
import { useRef } from "react";
import Slider from "react-slick";

const BannerThree = () => {
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
    <section className='banner-three'>
      <div className='container'>
        <div className='row align-items-center'>
          <div className='col-12 col-lg-8'>
            <div className='banner-three__slider swiper'>
              <Slider {...settings} ref={sliderRef} className='swiper-wrapper'>
                <div className='swiper-slide'>
                  <div className='banner-three__content'>
                    <span className='sub-title'>
                      <i className='icon-donation' />
                      Start donating poor people
                    </span>
                    <h1 className='title-animation_inner'>
                      We Are non <br />
                      profit charity <span className='bottom-line'>World</span>
                      Organization
                    </h1>
                    <p>
                      Denouncing pleasure and praising pain was born and will
                      give you saidul complete great explorer of the truth the
                      master-builder.
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
                  <div className='banner-three__content'>
                    <span className='sub-title'>
                      <i className='icon-donation' />
                      Start donating poor people
                    </span>
                    <h1 className='title-animation_inner'>
                      We Are non <br />
                      profit charity <span className='bottom-line'>World</span>
                      Organization
                    </h1>
                    <p>
                      Denouncing pleasure and praising pain was born and will
                      give you saidul complete great explorer of the truth the
                      master-builder.
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
                  <div className='banner-three__content'>
                    <span className='sub-title'>
                      <i className='icon-donation' />
                      Start donating poor people
                    </span>
                    <h1 className='title-animation_inner'>
                      We Are non <br />
                      profit charity <span className='bottom-line'>World</span>
                      Organization
                    </h1>
                    <p>
                      Denouncing pleasure and praising pain was born and will
                      give you saidul complete great explorer of the truth the
                      master-builder.
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
          <div className='col-12 col-lg-4 d-none d-lg-block'>
            <div className='banner-three__thumb'>
              <div className='banner-three__thumb-inner'>
                <div className='group'>
                  <div className='m-one move-image'>
                    <img
                      src='/assets/images/banner/m-one.png'
                      alt='Image_inner'
                      data-aos='fade-right'
                      data-aos-duration={1000}
                    />
                  </div>
                  <div className='m-three move-image'>
                    <img
                      src='/assets/images/banner/m-three.png'
                      alt='Image_inner'
                      data-aos='fade-right'
                      data-aos-duration={1000}
                      data-aos-delay={300}
                    />
                  </div>
                </div>
                <div className='group'>
                  <div className='m-two move-image'>
                    <img
                      src='/assets/images/banner/m-two.png'
                      alt='Image_inner'
                      data-aos='zoom-in'
                      data-aos-duration={1000}
                    />
                  </div>
                  <div className='m-four move-image'>
                    <img
                      src='/assets/images/banner/m-four.png'
                      alt='Image_inner'
                      data-aos='zoom-in'
                      data-aos-duration={1000}
                      data-aos-delay={300}
                    />
                  </div>
                </div>
                <div className='group'>
                  <div className='m-five move-image'>
                    <img
                      src='/assets/images/banner/m-five.png'
                      alt='Image_inner'
                      data-aos='fade-left'
                      data-aos-duration={1000}
                      data-aos-delay={300}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='shape-lg'>
        <img
          src='/assets/images/banner/banner-three-bg.png'
          alt='Image_inner'
          data-aos='zoom-in'
          data-aos-duration={1000}
        />
      </div>
      <div className='sprade-shape'>
        <img
          src='/assets/images/sprade-base.png'
          alt='Image_inner'
          className='base-img'
          data-aos='zoom-in'
          data-aos-duration={1000}
        />
      </div>
      <div className='parasuit'>
        <img src='/assets/images/parasuit.png' alt='Image_inner' />
      </div>
    </section>
  );
};

export default BannerThree;
