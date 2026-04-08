"use client";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
const CounterOne = () => {
  return (
    <section className='counter'>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div className='counter__inner'>
              <div
                className='counter__single'
                data-aos='fade-up'
                data-aos-duration={1000}
              >
                <div className='thumb'>
                  <i className='icon-support-hand' />
                </div>
                <div className='counter__content'>
                  <h2>
                    <TrackVisibility once>
                      {({ isVisible }) =>
                        isVisible && (
                          <span className='odometer'>
                            <CountUp delay={0} start={0} end={400} />
                          </span>
                        )
                      }
                    </TrackVisibility>
                    <span className='prefix'>+</span>
                  </h2>
                  <h5>Team member</h5>
                </div>
              </div>
              <div className='divider' />
              <div
                className='counter__single'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={300}
              >
                <div className='thumb'>
                  <i className='icon-review' />
                </div>
                <div className='counter__content'>
                  <h2>
                    <TrackVisibility once>
                      {({ isVisible }) =>
                        isVisible && (
                          <span className='odometer'>
                            <CountUp delay={0} start={0} end={80} />K
                          </span>
                        )
                      }
                    </TrackVisibility>
                    <span className='prefix'>+</span>
                  </h2>
                  <h5>Client's review</h5>
                </div>
              </div>
              <div className='divider' />
              <div
                className='counter__single'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={600}
              >
                <div className='thumb'>
                  <i className='icon-documents' />
                </div>
                <div className='counter__content'>
                  <h2>
                    <TrackVisibility once>
                      {({ isVisible }) =>
                        isVisible && (
                          <span className='odometer'>
                            <CountUp delay={0} start={0} end={100} />K
                          </span>
                        )
                      }
                    </TrackVisibility>
                    <span className='prefix'>+</span>
                  </h2>
                  <h5>Completed projects</h5>
                </div>
              </div>
              <div className='divider' />
              <div
                className='counter__single'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={900}
              >
                <div className='thumb'>
                  <i className='icon-award' />
                </div>
                <div className='counter__content'>
                  <h2>
                    <TrackVisibility once>
                      {({ isVisible }) =>
                        isVisible && (
                          <span className='odometer'>
                            <CountUp delay={0} start={0} end={40} />K
                          </span>
                        )
                      }
                    </TrackVisibility>
                    <span className='prefix'>+</span>
                  </h2>
                  <h5>Winning award</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='poor'>
        <img
          src='/assets/images/poor-two.png'
          alt='Image_inner'
          className='parallax-image'
        />
      </div>
      <div
        className='shape-left'
        data-aos='fade-down'
        data-aos-duration={1000}
        data-aos-delay={300}
      >
        <img
          src='/assets/images/cta/shape-left.png'
          alt='Image_inner'
          className='base-img'
        />
      </div>
    </section>
  );
};

export default CounterOne;
