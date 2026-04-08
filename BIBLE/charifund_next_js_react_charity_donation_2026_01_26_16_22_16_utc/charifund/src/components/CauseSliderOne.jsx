"use client";
import { useRef } from "react";
import Slider from "react-slick";
import ProgressBar from "../helper/ProgressBar";
import Link from "next/link";

const CauseSliderOne = () => {
  const sliderRef = useRef(null);
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 20000,
    pauseOnHover: true,
    arrows: false,
    dots: true,

    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          dots: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          dots: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <section
      className='cause cause-alt'
      style={{
        backgroundImage: "url(/assets/images/cause/cause-bg.png)",
      }}
    >
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-xl-7'>
            <div className='section__header text-center'>
              <span className='sub-title'>
                <i className='icon-donation' />
                Start donating poor people
              </span>
              <h2 className='title-animation_inner'>
                Be the reason of someone
                <span>smiles</span> Causes
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className='cause-inner__wrapper'>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <div className='cause__slider-wrapper'>
                <div className='cause__slider swiper'>
                  <Slider
                    {...settings}
                    ref={sliderRef}
                    className='swiper-wrapper'
                  >
                    <div className='swiper-slide'>
                      <div className='cause__slider-inner'>
                        <div className='cause__slider-single'>
                          <div className='thumb'>
                            <Link href='/cause-details'>
                              <img
                                src='assets/images/cause/one.png'
                                alt='Image_inner'
                              />
                            </Link>
                            <div className='tag'>
                              <Link href='/our-causes'>Health</Link>
                            </div>
                          </div>
                          <div className='content'>
                            <h6>
                              <Link href='/cause-details'>
                                Children we work with
                              </Link>
                            </h6>
                            <p>
                              Lorem ipsum dolor sit amet, consete sadipscing
                              elitr, sed diam nonum
                            </p>
                          </div>
                          <div className='cause__slider-cta'>
                            <div className='cause__progress progress-bar-single'>
                              {/* ProgressBar */}
                              <ProgressBar percent={85} />
                              {/* ProgressBar */}
                              <div className='cause-progress__goal'>
                                <p>
                                  Raised: <span className='raised'>$8500</span>
                                </p>
                                <p>
                                  Goal: <span className='goal'>$1,0000</span>
                                </p>
                              </div>
                            </div>
                            <div className='cause__cta'>
                              <Link
                                href='/donate-us'
                                aria-label='donate now'
                                title='donate now'
                                className='btn--secondary'
                              >
                                Donate Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide'>
                      <div className='cause__slider-inner'>
                        <div className='cause__slider-single'>
                          <div className='thumb'>
                            <Link href='/cause-details'>
                              <img
                                src='assets/images/cause/two.png'
                                alt='Image_inner'
                              />
                            </Link>
                            <div className='tag'>
                              <Link href='/our-causes'>Food</Link>
                            </div>
                          </div>
                          <div className='content'>
                            <h6>
                              <Link href='/cause-details'>
                                Help For Education
                              </Link>
                            </h6>
                            <p>
                              Lorem ipsum dolor sit amet, consete sadipscing
                              elitr, sed diam nonum
                            </p>
                          </div>
                          <div className='cause__slider-cta'>
                            <div className='cause__progress progress-bar-single'>
                              {/* ProgressBar */}
                              <ProgressBar percent={90} />
                              {/* ProgressBar */}
                              <div className='cause-progress__goal'>
                                <p>
                                  Raised: <span className='raised'>$8500</span>
                                </p>
                                <p>
                                  Goal: <span className='goal'>$1,0000</span>
                                </p>
                              </div>
                            </div>
                            <div className='cause__cta'>
                              <Link
                                href='/donate-us'
                                aria-label='donate now'
                                title='donate now'
                                className='btn--secondary'
                              >
                                Donate Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide'>
                      <div className='cause__slider-inner'>
                        <div className='cause__slider-single'>
                          <div className='thumb'>
                            <Link href='/cause-details'>
                              <img
                                src='assets/images/cause/three.png'
                                alt='Image_inner'
                              />
                            </Link>
                            <div className='tag'>
                              <Link href='/our-causes'>Health</Link>
                            </div>
                          </div>
                          <div className='content'>
                            <h6>
                              <Link href='/cause-details'>Help For Food</Link>
                            </h6>
                            <p>
                              Lorem ipsum dolor sit amet, consete sadipscing
                              elitr, sed diam nonum
                            </p>
                          </div>
                          <div className='cause__slider-cta'>
                            <div className='cause__progress progress-bar-single'>
                              {/* ProgressBar */}
                              <ProgressBar percent={75} />
                              {/* ProgressBar */}
                              <div className='cause-progress__goal'>
                                <p>
                                  Raised: <span className='raised'>$8500</span>
                                </p>
                                <p>
                                  Goal: <span className='goal'>$1,0000</span>
                                </p>
                              </div>
                            </div>
                            <div className='cause__cta'>
                              <Link
                                href='/donate-us'
                                aria-label='donate now'
                                title='donate now'
                                className='btn--secondary'
                              >
                                Donate Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide'>
                      <div className='cause__slider-inner'>
                        <div className='cause__slider-single'>
                          <div className='thumb'>
                            <Link href='/cause-details'>
                              <img
                                src='assets/images/cause/four.png'
                                alt='Image_inner'
                              />
                            </Link>
                            <div className='tag'>
                              <Link href='/our-causes'>Food</Link>
                            </div>
                          </div>
                          <div className='content'>
                            <h6>
                              <Link href='/cause-details'>
                                Give health support
                              </Link>
                            </h6>
                            <p>
                              Lorem ipsum dolor sit amet, consete sadipscing
                              elitr, sed diam nonum
                            </p>
                          </div>
                          <div className='cause__slider-cta'>
                            <div className='cause__progress progress-bar-single'>
                              {/* ProgressBar */}
                              <ProgressBar percent={65} />
                              {/* ProgressBar */}
                              <div className='cause-progress__goal'>
                                <p>
                                  Raised: <span className='raised'>$8500</span>
                                </p>
                                <p>
                                  Goal: <span className='goal'>$1,0000</span>
                                </p>
                              </div>
                            </div>
                            <div className='cause__cta'>
                              <Link
                                href='/donate-us'
                                aria-label='donate now'
                                title='donate now'
                                className='btn--secondary'
                              >
                                Donate Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide'>
                      <div className='cause__slider-inner'>
                        <div className='cause__slider-single'>
                          <div className='thumb'>
                            <Link href='/cause-details'>
                              <img
                                src='assets/images/cause/one.png'
                                alt='Image_inner'
                              />
                            </Link>
                            <div className='tag'>
                              <Link href='/our-causes'>Health</Link>
                            </div>
                          </div>
                          <div className='content'>
                            <h6>
                              <Link href='/cause-details'>
                                Children we work with
                              </Link>
                            </h6>
                            <p>
                              Lorem ipsum dolor sit amet, consete sadipscing
                              elitr, sed diam nonum
                            </p>
                          </div>
                          <div className='cause__slider-cta'>
                            <div className='cause__progress progress-bar-single'>
                              {/* ProgressBar */}
                              <ProgressBar percent={85} />
                              {/* ProgressBar */}
                              <div className='cause-progress__goal'>
                                <p>
                                  Raised: <span className='raised'>$8500</span>
                                </p>
                                <p>
                                  Goal: <span className='goal'>$1,0000</span>
                                </p>
                              </div>
                            </div>
                            <div className='cause__cta'>
                              <Link
                                href='/donate-us'
                                aria-label='donate now'
                                title='donate now'
                                className='btn--secondary'
                              >
                                Donate Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide'>
                      <div className='cause__slider-inner'>
                        <div className='cause__slider-single'>
                          <div className='thumb'>
                            <Link href='/cause-details'>
                              <img
                                src='assets/images/cause/two.png'
                                alt='Image_inner'
                              />
                            </Link>
                            <div className='tag'>
                              <Link href='/our-causes'>Food</Link>
                            </div>
                          </div>
                          <div className='content'>
                            <h6>
                              <Link href='/cause-details'>
                                Help For Education
                              </Link>
                            </h6>
                            <p>
                              Lorem ipsum dolor sit amet, consete sadipscing
                              elitr, sed diam nonum
                            </p>
                          </div>
                          <div className='cause__slider-cta'>
                            <div className='cause__progress progress-bar-single'>
                              {/* ProgressBar */}
                              <ProgressBar percent={90} />
                              {/* ProgressBar */}
                              <div className='cause-progress__goal'>
                                <p>
                                  Raised: <span className='raised'>$8500</span>
                                </p>
                                <p>
                                  Goal: <span className='goal'>$1,0000</span>
                                </p>
                              </div>
                            </div>
                            <div className='cause__cta'>
                              <Link
                                href='/donate-us'
                                aria-label='donate now'
                                title='donate now'
                                className='btn--secondary'
                              >
                                Donate Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide'>
                      <div className='cause__slider-inner'>
                        <div className='cause__slider-single'>
                          <div className='thumb'>
                            <Link href='/cause-details'>
                              <img
                                src='assets/images/cause/three.png'
                                alt='Image_inner'
                              />
                            </Link>
                            <div className='tag'>
                              <Link href='/our-causes'>Health</Link>
                            </div>
                          </div>
                          <div className='content'>
                            <h6>
                              <Link href='/cause-details'>Help For Food</Link>
                            </h6>
                            <p>
                              Lorem ipsum dolor sit amet, consete sadipscing
                              elitr, sed diam nonum
                            </p>
                          </div>
                          <div className='cause__slider-cta'>
                            <div className='cause__progress progress-bar-single'>
                              {/* ProgressBar */}
                              <ProgressBar percent={75} />
                              {/* ProgressBar */}
                              <div className='cause-progress__goal'>
                                <p>
                                  Raised: <span className='raised'>$8500</span>
                                </p>
                                <p>
                                  Goal: <span className='goal'>$1,0000</span>
                                </p>
                              </div>
                            </div>
                            <div className='cause__cta'>
                              <Link
                                href='/donate-us'
                                aria-label='donate now'
                                title='donate now'
                                className='btn--secondary'
                              >
                                Donate Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='swiper-slide'>
                      <div className='cause__slider-inner'>
                        <div className='cause__slider-single'>
                          <div className='thumb'>
                            <Link href='/cause-details'>
                              <img
                                src='assets/images/cause/four.png'
                                alt='Image_inner'
                              />
                            </Link>
                            <div className='tag'>
                              <Link href='/our-causes'>Food</Link>
                            </div>
                          </div>
                          <div className='content'>
                            <h6>
                              <Link href='/cause-details'>
                                Give health support
                              </Link>
                            </h6>
                            <p>
                              Lorem ipsum dolor sit amet, consete sadipscing
                              elitr, sed diam nonum
                            </p>
                          </div>
                          <div className='cause__slider-cta'>
                            <div className='cause__progress progress-bar-single'>
                              {/* ProgressBar */}
                              <ProgressBar percent={65} />
                              {/* ProgressBar */}
                              <div className='cause-progress__goal'>
                                <p>
                                  Raised: <span className='raised'>$8500</span>
                                </p>
                                <p>
                                  Goal: <span className='goal'>$1,0000</span>
                                </p>
                              </div>
                            </div>
                            <div className='cause__cta'>
                              <Link
                                href='/donate-us'
                                aria-label='donate now'
                                title='donate now'
                                className='btn--secondary'
                              >
                                Donate Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='slider-navigation'>
          <button
            type='button'
            onClick={() => sliderRef.current.slickPrev()}
            aria-label='prev slide'
            title='prev slide'
            className='prev-cause slider-btn'
          >
            <i className='fa-solid fa-arrow-left' />
          </button>
          <button
            type='button'
            onClick={() => sliderRef.current.slickNext()}
            aria-label='next slide'
            title='next slide'
            className='next-cause slider-btn slider-btn-next'
          >
            <i className='fa-solid fa-arrow-right' />
          </button>
        </div>
      </div>
      <div className='spade'>
        <img src='assets/images/help/spade.png' alt='Image_inner' />
      </div>
    </section>
  );
};

export default CauseSliderOne;
