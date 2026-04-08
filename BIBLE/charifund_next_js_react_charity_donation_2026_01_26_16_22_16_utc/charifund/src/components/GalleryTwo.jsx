"use client";
import { useState } from "react";
import ModalVideo from "react-modal-video";
const GalleryTwo = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <section className='ff-gallery pt-120 pb-120'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-lg-10 col-xl-7'>
              <div
                className='section__header text-center'
                data-aos='fade-up'
                data-aos-duration={1000}
              >
                <span className='sub-title'>
                  We are always open for children
                </span>
                <h2 className='title-animation_inner mt-0 fw-6'>
                  Recent Causes gallery
                </h2>
              </div>
            </div>
          </div>
          <div className='row justify-content-center'>
            <div className='col-12 col-xl-6'>
              <div className='thumb-lg'>
                <img
                  src='assets/images/gallery-two/thumb.png'
                  alt='Image_inner'
                />
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
        </div>
        <div className='left-group'>
          <div className='m-one move-image'>
            <img
              src='assets/images/gallery-two/one.png'
              alt='Image_inner'
              data-aos='fade-right'
              data-aos-duration={1000}
            />
          </div>
          <div className='m-two move-image'>
            <img
              src='assets/images/gallery-two/two.png'
              alt='Image_inner'
              data-aos='fade-right'
              data-aos-duration={1000}
            />
          </div>
          <div className='m-three move-image'>
            <img
              src='assets/images/gallery-two/three.png'
              alt='Image_inner'
              data-aos='fade-right'
              data-aos-duration={1000}
            />
          </div>
        </div>
        <div className='right-group'>
          <div className='m-one move-image'>
            <img
              src='assets/images/gallery-two/one.png'
              alt='Image_inner'
              data-aos='fade-left'
              data-aos-duration={1000}
            />
          </div>
          <div className='m-two move-image'>
            <img
              src='assets/images/gallery-two/two.png'
              alt='Image_inner'
              data-aos='fade-left'
              data-aos-duration={1000}
            />
          </div>
          <div className='m-three move-image'>
            <img
              src='assets/images/gallery-two/four.png'
              alt='Image_inner'
              data-aos='fade-left'
              data-aos-duration={1000}
            />
          </div>
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

export default GalleryTwo;
