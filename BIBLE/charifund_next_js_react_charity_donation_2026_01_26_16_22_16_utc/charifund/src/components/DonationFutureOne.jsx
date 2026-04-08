"use client";
import Link from "next/link";
import { useState } from "react";
import ModalVideo from "react-modal-video";

const DonationFutureOne = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {" "}
      <section className='donation-future'>
        <div className='container'>
          <div className='row gutter-40'>
            <div className='col-12 col-lg-6 col-xl-7'>
              <div className='donation-future__content'>
                <div
                  className='section__content'
                  data-aos='fade-up'
                  data-aos-duration={1000}
                >
                  <span className='sub-title'>
                    <i className='icon-donation' />
                    Start donating poor people
                  </span>
                  <h2 className='title-animation_inner'>
                    Building A Better <span>Future</span>
                    Together By Donations
                  </h2>
                  <div className='video-btn-wrapper'>
                    <button
                      onClick={() => setIsOpen(true)}
                      className='open-video-popup'
                    >
                      <i className='icon-play' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-lg-6 col-xl-5'>
              <div
                className='donation-future__thumb'
                style={{
                  backgroundImage: "url(/assets/images/donation/thumb-bg.png)",
                }}
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={300}
              >
                <h4>Support for Food Expenses</h4>
                <div className='cause__progress progress-bar-single'>
                  <div className='cause-progress__bar'>
                    <div className='progress-bar-wrapper' data-percent='60%'>
                      <div className='progress-bar'>
                        <div
                          className='progress-bar-percent'
                          style={{ width: "60%" }}
                        >
                          <span className='percent-value' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='cause-progress__goal'>
                  <p>
                    Raised: <span className='raised'>$8500</span>
                  </p>
                  <p>
                    Goal: <span className='goal'>$1,00,000</span>
                  </p>
                </div>
                <hr />
                <div className='made-amount'>
                  <span className='donation-amount'>$100</span>
                  <span className='donation-amount'>$200</span>
                  <span className='donation-amount active'>$500</span>
                  <span className='donation-amount'>$1000</span>
                  <span className='donation-amount'>$10000</span>
                </div>
                <div className='cta'>
                  <Link href='/donate-us' className='btn--primary'>
                    Donate Now <i className='icon-heart' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='donation-bg'>
          <img
            src='/assets/images/donation/bg.png'
            alt='Image_inner'
            className='parallax-image'
          />
          <img
            src='/assets/images/donation/shape.png'
            alt='Image_inner'
            className='shape'
          />
        </div>
      </section>
      <ModalVideo
        channel='youtube'
        autoplay
        isOpen={isOpen}
        videoId='XxVg_s8xAms'
        onClose={() => setIsOpen(false)}
        allowFullScreen
      />
    </>
  );
};

export default DonationFutureOne;
