"use client";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
import Slider from "react-slick";

const PartnerFive = () => {
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToScroll: 1,
    slidesToShow: 5,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    dots: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 420,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };
  return (
    <div className='partner fc-partner cf-p pt-120 pb-120'>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div className='text-center'>
              <h5 className='fw-5'>
                <TrackVisibility once>
                  {({ isVisible }) =>
                    isVisible && (
                      <>
                        Over{" "}
                        <span className='odometer'>
                          <CountUp delay={0} start={0} end={20000} />
                        </span>{" "}
                        Companies Trust Us Globally
                      </>
                    )
                  }
                </TrackVisibility>
              </h5>
            </div>
          </div>
          <div className='col-12'>
            <div className='partner__slider swiper'>
              <Slider {...settings} className='swiper-wrapper'>
                <div className='swiper-slide'>
                  <div className='partner__slider-single'>
                    <img
                      src='assets/images/sponsor/one.png'
                      alt='Image_inner'
                    />
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='partner__slider-single'>
                    <img
                      src='assets/images/sponsor/two.png'
                      alt='Image_inner'
                    />
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='partner__slider-single'>
                    <img
                      src='assets/images/sponsor/three.png'
                      alt='Image_inner'
                    />
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='partner__slider-single'>
                    <img
                      src='assets/images/sponsor/four.png'
                      alt='Image_inner'
                    />
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='partner__slider-single'>
                    <img
                      src='assets/images/sponsor/five.png'
                      alt='Image_inner'
                    />
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='partner__slider-single'>
                    <img
                      src='assets/images/sponsor/one.png'
                      alt='Image_inner'
                    />
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='partner__slider-single'>
                    <img
                      src='assets/images/sponsor/two.png'
                      alt='Image_inner'
                    />
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='partner__slider-single'>
                    <img
                      src='assets/images/sponsor/three.png'
                      alt='Image_inner'
                    />
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='partner__slider-single'>
                    <img
                      src='assets/images/sponsor/four.png'
                      alt='Image_inner'
                    />
                  </div>
                </div>
                <div className='swiper-slide'>
                  <div className='partner__slider-single'>
                    <img
                      src='assets/images/sponsor/five.png'
                      alt='Image_inner'
                    />
                  </div>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>
      <div className='th-t'>
        <img src='assets/images/leaf.png' alt='Image_inner' />
      </div>
    </div>
  );
};

export default PartnerFive;
