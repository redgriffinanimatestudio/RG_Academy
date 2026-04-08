"use client";
import Link from "next/link";
import { useState } from "react";
import ModalVideo from "react-modal-video";

const VolunteerTwo = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <section className='ff-volunteer'>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <div
                className='ff-volunteer__inner text-center text-lg-start'
                style={{
                  backgroundImage: "url(/assets/images/volunteer-bg.png)",
                }}
              >
                <div className='row align-items-center gutter-40'>
                  <div className='col-12 col-lg-8'>
                    <div className='ff-volunteer-content'>
                      <i className='icon-spread-love' />
                      <h3 className='fw-7 title-animation_inner mt-25'>
                        Become an volunteer?
                      </h3>
                      <div className='mt-25'>
                        <Link href='/contact-us'>
                          Contact with Us{" "}
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width={39}
                            height={13}
                            viewBox='0 0 39 13'
                            fill='none'
                          >
                            <path
                              d='M38.6044 7.85781C39.1319 7.59411 39.1319 6.73707 38.6044 6.47337C34.5171 4.2319 30.3637 2.1882 25.8808 1.00154C25.2215 0.869685 24.5623 1.59487 24.9578 2.1882C25.8808 3.50671 27.0015 4.62745 28.32 5.61633C19.0905 5.35263 9.53123 4.10004 0.433491 6.27559C-0.225765 6.40744 -0.0939178 7.52807 0.565449 7.46215C9.99282 6.27559 19.3543 7.19855 28.7816 7.3303C27.7927 8.45103 26.8039 9.57177 25.815 10.6266C25.3535 11.0881 25.6172 12.0771 26.4083 12.0111C30.7593 11.4836 34.8467 10.0332 38.6044 7.85781ZM30.7593 7.13263C31.3526 6.73707 31.2208 5.61633 30.2978 5.61633C30.2319 5.61633 30.166 5.61633 30.166 5.61633C29.3749 4.82523 28.5837 4.10004 27.7926 3.24301C30.8252 4.29782 33.66 5.61634 36.4948 7.13252C33.9237 8.45103 31.2867 9.43992 28.4519 9.96732C29.1112 9.24214 29.7704 8.45103 30.4956 7.72574C30.7593 7.5941 30.8252 7.33029 30.7593 7.13263Z'
                              fill='white'
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className='col-12 col-lg-4'>
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
                <div className='th-right'>
                  <img
                    src='assets/images/ff-testimonial.png'
                    alt='Image_inner'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='th-top'>
          <img
            src='assets/images/heart.png'
            alt='Image_inner'
            className='base-img'
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

export default VolunteerTwo;
