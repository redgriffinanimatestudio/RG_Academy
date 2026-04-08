"use client";
import { useState } from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
const CommitOne = () => {
  let [active, setActive] = useState(1);

  return (
    <section className='commit pt-120 pb-120'>
      <div className='container'>
        <div className='row gutter-40 align-items-center'>
          <div className='col-12 col-lg-5 col-xl-5'>
            <div className='commit__thumb'>
              <div className='thumb-lg'>
                <img src='assets/images/commit-thumb.png' alt='Image_inner' />
              </div>
              <div className='thumb-sm'>
                <img src='assets/images/commit-shape.png' alt='Image_inner' />
              </div>
              <div className='commit-count'>
                <h4>
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className='odometer fw-7'>
                          <CountUp delay={0} start={0} end={20000} />
                          <span className='prefix fw-7'>+</span>
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h4>
                <p className='text-black'>People have donated here</p>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-7 col-xl-6 offset-xl-1'>
            <div className='commit__content'>
              <span className='sub-title'>We are always open for children</span>
              <h2 className='title-animation_inner fw-7'>
                We're Committed to Help those less fortuness.
              </h2>
              <p>
                Transmax is the world's driving worldwide coordinations supplier
                — we uphold industry and exchange the worldwide trade of mercha
              </p>
              <div className='commit__tab mt-40'>
                <div className='commit__tab-wrapper'>
                  <div
                    className={`commmit-tab-single ${
                      active === 1 ? "" : "d-none"
                    }`}
                    id='commit-one'
                  >
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
                  <div
                    className={`commmit-tab-single ${
                      active === 2 ? "" : "d-none"
                    }`}
                    id='commit-two'
                  >
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
                  <div
                    className={`commmit-tab-single ${
                      active === 3 ? "" : "d-none"
                    }`}
                    id='commit-three'
                  >
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
                <div className='commit__tab-btns mt-40'>
                  <button
                    onClick={() => setActive(1)}
                    className={`commit__tab-btn ${active === 1 && "active"} `}
                    data-target='#commit-one'
                    aria-label='Check Your Causes'
                    title='Check Your Causes'
                  >
                    Check Your Causes
                  </button>
                  <button
                    onClick={() => setActive(2)}
                    className={`commit__tab-btn ${active === 2 && "active"} `}
                    data-target='#commit-two'
                    aria-label='Charity For Foods'
                    title='Charity For Foods'
                  >
                    Charity For Foods
                  </button>
                  <button
                    onClick={() => setActive(3)}
                    className={`commit__tab-btn ${active === 3 && "active"} `}
                    data-target='#commit-three'
                    aria-label='Charity FOr Water'
                    title='Charity FOr Water'
                  >
                    Charity For Water
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommitOne;
