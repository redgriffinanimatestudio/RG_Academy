"use client";
import Link from "next/link";
import { useState } from "react";
import ModalVideo from "react-modal-video";

const HelpOne = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <section className='help'>
        <div className='container'>
          <div className='row align-items-center gutter-40'>
            <div className='col-12 col-lg-5 col-xxl-6 d-none d-lg-block'>
              <div className='help__thumb'>
                <div className='help__thumb-inner'>
                  <div className='thumb-top thumb'>
                    <img
                      src='/assets/images/help/thumb-top.png'
                      alt='Image_inner'
                    />
                  </div>
                  <div
                    className='thumb-lg thumb'
                    data-aos='fade-left'
                    data-aos-duration={1000}
                  >
                    <img
                      src='/assets/images/help/thumb-lg.png'
                      alt='Image_inner'
                    />
                    <div className='video-btn-wrapper'>
                      <span
                        onClick={() => setIsOpen(true)}
                        className='open-video-popup'
                      >
                        <i className='icon-play' />
                      </span>
                    </div>
                  </div>
                  <div className='thumb thumb-bottom'>
                    <img
                      src='/assets/images/help/thumb-bottom.png'
                      alt='Image_inner'
                    />
                  </div>
                  <div className='line'>
                    <img src='/assets/images/help/line.png' alt='Image_inner' />
                  </div>
                  <div className='grid-line'>
                    <img
                      src='/assets/images/help/grid.png'
                      alt='Image_inner'
                      className='base-img'
                    />
                  </div>
                  <div className='vertical-text'>
                    <h5>
                      We Give <span>Donations</span> to Poor People{" "}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-lg-7 col-xxl-6'>
              <div className='help__content'>
                <span className='sub-title'>
                  <i className='icon-donation' />
                  Start donating poor people
                </span>
                <h2 className='title-animation_inner'>
                  Helping each other can make <span>world</span> better
                </h2>
                <p>
                  Volunteering offers opportunities to develop new skills and
                  gain valuable experience. This can include leadership,
                  communication, project management, and teamwork skills.
                </p>
                <div className='help__content-icon-group'>
                  <div className='help__content-icon'>
                    <div className='thumb'>
                      <i className='icon-make-donation' />
                    </div>
                    <div className='content'>
                      <h6>Start helping them</h6>
                      <p>
                        Raising awareness about the charity's mission and cause.
                      </p>
                    </div>
                  </div>
                  <div className='help__content-icon'>
                    <div className='thumb'>
                      <i className='icon-support-heart' />
                    </div>
                    <div className='content'>
                      <h6>Make Donations</h6>
                      <p>
                        Raising awareness about the charity's mission and cause.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='help__content-list'>
                  <ul>
                    <li>
                      <i className='fa-solid fa-circle-check' /> Helped fund
                      3,265 Project powerful corporate poor.
                    </li>
                    <li>
                      <i className='fa-solid fa-circle-check' /> We give child a
                      gift of a education
                    </li>
                    <li>
                      <i className='fa-solid fa-circle-check' /> We help
                      companies develop powerful corporate social
                      Responsibility,
                    </li>
                  </ul>
                </div>
                <div className='help__content-cta cta'>
                  <Link
                    href='/about-us'
                    aria-label='more about us'
                    title='about us'
                    className='btn--primary'
                  >
                    More About Us
                  </Link>
                  <div className='contact-btn'>
                    <div className='contact-icon'>
                      <i className='icon-phone' />
                    </div>
                    <div className='contact-content'>
                      <p>Phone</p>
                      <a href='tel:01-793-7938'>+236 (456) 896 22</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='hand'>
          <img src='/assets/images/help/hand.png' alt='Image_inner' />
        </div>
        <div className='parasuit'>
          <img src='/assets/images/parasuit.png' alt='Image_inner' />
        </div>
        <div className='spade'>
          <img src='/assets/images/help/spade.png' alt='Image_inner' />
        </div>

        <ModalVideo
          channel='youtube'
          autoplay
          isOpen={isOpen}
          videoId='XxVg_s8xAms'
          onClose={() => setIsOpen(false)}
          allowFullScreen
        />
      </section>
    </>
  );
};

export default HelpOne;
