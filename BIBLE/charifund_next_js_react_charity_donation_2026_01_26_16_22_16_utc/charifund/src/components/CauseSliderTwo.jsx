"use client";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";

const images = [
  "assets/images/cause/five.png",
  "assets/images/cause/six.png",
  "assets/images/cause/seven.png",
  "assets/images/cause/five.png",
  "assets/images/cause/six.png",
  "assets/images/cause/seven.png",
];

const texts = [
  "Child & old care",
  "Child & old care",
  "Child & old care",
  "Child & old care",
  "Child & old care",
  "Child & old care",
];

const CauseSliderTwo = () => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  const slider1 = useRef();
  const slider2 = useRef();

  useEffect(() => {
    setNav1(slider1.current);
    setNav2(slider2.current);
  }, []);

  const imageSettings = {
    asNavFor: nav2,
    ref: slider1,
    slidesToShow: 3,
    swipeToSlide: true,
    focusOnSelect: true,
    autoplay: false,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1400,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const contentSettings = {
    asNavFor: nav1,
    ref: slider2,
    slidesToShow: 1,
    fade: true,
    arrows: false,
  };

  return (
    <>
      <section className='cause-two'>
        <div className='container-fluid'>
          <div className='cause-two__inner'>
            {/* Arrows */}
            <div className='slider-navigation'>
              <button
                className='prev-cause-two slider-btn'
                onClick={() => slider1.current.slickPrev()}
              >
                <i className='fa-solid fa-arrow-left'></i>
              </button>
              <button
                className='next-cause-two slider-btn slider-btn-next'
                onClick={() => slider1.current.slickNext()}
              >
                <i className='fa-solid fa-arrow-right'></i>
              </button>
            </div>

            {/* Thumbnail Slider */}
            <Slider {...imageSettings} className='cause-two__slider'>
              {images.map((img, index) => (
                <div key={index} className='cause-two__slider-single'>
                  <div className='cause-thumb'>
                    <img src={img} alt={`Slide ${index}`} />
                    <Link href='/cause-details'>
                      <i className='fa-solid fa-arrow-right'></i>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>

            {/* Content Slider */}
            <Slider {...contentSettings} className='cause-two__content-slider'>
              {texts.map((text, index) => (
                <div key={index} className='cause-content'>
                  <h4>Old People & Child Trouble</h4>
                  <p>{text}</p>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
};

export default CauseSliderTwo;
