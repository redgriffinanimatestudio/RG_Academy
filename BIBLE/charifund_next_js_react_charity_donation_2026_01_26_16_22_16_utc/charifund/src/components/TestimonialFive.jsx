"use client";
import Link from "next/link";
import { useRef } from "react";
import Slider from "react-slick";

const TestimonialFive = () => {
  const sliderRef = useRef(null);
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToScroll: 1,
    slidesToShow: 2,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "8%",
    arrows: false,
    dots: true,
    appendDots: (dots) => <div className='ff-test-pagination'>{dots}</div>,
    customPaging: () => <button className='dot' />,

    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          centerPadding: "20%",
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          centerPadding: "8%",
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          centerPadding: "10%",
        },
      },
    ],
  };

  return (
    <section className='ff-testimonial pt-120 pb-120'>
      <div className='container'>
        <div className='row gutter-30 align-items-center mb-60'>
          <div className='col-12 col-md-8 col-xl-7'>
            <div className='section__header mb-0'>
              <span className='sub-title'>We are always open for children</span>
              <h2 className='title-animation_inner mt-0 fw-7 hb'>
                Helping each other can make world better
              </h2>
            </div>
          </div>
          <div className='col-12 col-md-4 col-xl-5'>
            <div className='text-start text-xl-end'>
              <Link
                href='/our-causes'
                aria-label='check causes'
                title='check causes'
                className='btn--primary'
              >
                Check Our Causes
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='ff-testimonial-slider five swiper'>
        <Slider {...settings} ref={sliderRef} className='swiper-wrapper'>
          <div className='swiper-slide'>
            <div className='ff-testimonial__single'>
              <q className='text-xl fw-7'>great experience</q>
              <p className='text-xl fw-5 content-p mt-60'>
                Sasstech hires great people from a widely variety of
                backgrounds, which simply makes our compan stronger, and we
                couldn't be prouder of that. elevating your optimizing Business
                Growth.
              </p>
              <p className='designation-p mt-60'>
                <span className='text-xl fw-7'>Robert J. Hare /</span> Graphics
                Designer
              </p>
              <img src='assets/images/ff-testimonial.png' alt='Image_inner' />
            </div>
          </div>
          <div className='swiper-slide'>
            <div className='ff-testimonial__single'>
              <q className='text-xl fw-7'>great experience</q>
              <p className='text-xl fw-5 content-p mt-60'>
                Sasstech hires great people from a widely variety of
                backgrounds, which simply makes our compan stronger, and we
                couldn't be prouder of that. elevating your optimizing Business
                Growth.
              </p>
              <p className='designation-p mt-60'>
                <span className='text-xl fw-7'>Robert J. Hare /</span> Graphics
                Designer
              </p>
              <img src='assets/images/ff-testimonial.png' alt='Image_inner' />
            </div>
          </div>
          <div className='swiper-slide'>
            <div className='ff-testimonial__single'>
              <q className='text-xl fw-7'>great experience</q>
              <p className='text-xl fw-5 content-p mt-60'>
                Sasstech hires great people from a widely variety of
                backgrounds, which simply makes our compan stronger, and we
                couldn't be prouder of that. elevating your optimizing Business
                Growth.
              </p>
              <p className='designation-p mt-60'>
                <span className='text-xl fw-7'>Robert J. Hare /</span> Graphics
                Designer
              </p>
              <img src='assets/images/ff-testimonial.png' alt='Image_inner' />
            </div>
          </div>
          <div className='swiper-slide'>
            <div className='ff-testimonial__single'>
              <q className='text-xl fw-7'>great experience</q>
              <p className='text-xl fw-5 content-p mt-60'>
                Sasstech hires great people from a widely variety of
                backgrounds, which simply makes our compan stronger, and we
                couldn't be prouder of that. elevating your optimizing Business
                Growth.
              </p>
              <p className='designation-p mt-60'>
                <span className='text-xl fw-7'>Robert J. Hare /</span> Graphics
                Designer
              </p>
              <img src='assets/images/ff-testimonial.png' alt='Image_inner' />
            </div>
          </div>
        </Slider>
      </div>
      <div className='ff-test-pagination pagination-one mt-40' />
      <div className='th-right'>
        <img src='assets/images/community/gift.png' alt='Image_inner' />
      </div>
      <div className='th-left'>
        <img src='assets/images/fc-nine.png' alt='Image_inner' />
      </div>
      <div className='th-top'>
        <img src='assets/images/hand.png' alt='Image_inner' />
      </div>
      <div className='th-top-r'>
        <img src='assets/images/fc-eleven.png' alt='Image_inner' />
      </div>
    </section>
  );
};

export default TestimonialFive;
