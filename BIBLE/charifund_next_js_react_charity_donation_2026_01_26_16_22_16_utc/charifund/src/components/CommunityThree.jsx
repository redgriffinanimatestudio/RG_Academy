"use client";

import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
const CommunityThree = () => {
  return (
    <section className='ff-community counter-four commit pb-120'>
      <div className='container'>
        <div className='row gutter-40 align-items-center'>
          <div className='col-12 col-xl-6'>
            <div className='ff-community__content'>
              <div
                className='section__header mb-0'
                data-aos='fade-up'
                data-aos-duration={1000}
              >
                <span className='sub-title'>
                  We are always open for children
                </span>
                <h2 className='title-animation_inner fw-6 mt-0'>
                  Helping each other can make world better
                </h2>
                <p className='mt-20 text-gr mx-0'>
                  Volunteering offers opportunities to develop new skills and
                  gain valuable experience. This can include leadership,
                  communication, project
                </p>
              </div>
              <div className='counter-four__content mt-20'>
                <h3 className='hb cnt'>
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className='odometer fw-8'>
                          <CountUp delay={0} start={0} end={154859} />
                          <span className='prefix txt-base'>+</span>
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h3>
                <p className='text-xl fw-5 text-gr mt-10'>
                  Join the Many Who Already Support Our Mission
                </p>
              </div>
              <div className='commmit-tab-single mt-40'>
                <div className='commit-tab-inner'>
                  <div className='thumb'>
                    <i className='icon-donation' />
                  </div>
                  <div className='content'>
                    <p className='text-lg fw-7'>Trusted organization</p>
                    <p>Welcome to our Print 128 company that offers a</p>
                  </div>
                </div>
                <span className='divider d-none d-xxl-block' />
                <div className='commit-tab-inner'>
                  <div className='thumb'>
                    <i className='icon-award' />
                  </div>
                  <div className='content'>
                    <p className='text-lg fw-7'>Awarded services</p>
                    <p>Welcome to our Print 128 company that offers a</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-xl-5 offset-xl-1'>
            <div className='ff-community__thumb'>
              <div className='tc-one'>
                <h3 className='fw-6'>12 million+</h3>
                <p className='mt-10 txt-lg'>
                  Children's Lives Changed, Thanks to Your Support
                </p>
              </div>
              <div className='tc-wrapper mt-60'>
                <div className='tc-two'>
                  <h5 className='fw-6'>Claims</h5>
                  <p className='mt-10'>Get Support by expert easily.</p>
                </div>
                <div className='tc-three'>
                  <h3 className='fw-7'>
                    35+ <br />
                    Projects
                  </h3>
                  <p className='mt-10'>
                    Volunteering offers opportunities to develop new skills and
                    gain experience. This can include{" "}
                  </p>
                  <img src='assets/images/line.png' alt='Image_inner' />
                </div>
              </div>
              <img src='assets/images/dot.png' alt='Image_inner' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityThree;
