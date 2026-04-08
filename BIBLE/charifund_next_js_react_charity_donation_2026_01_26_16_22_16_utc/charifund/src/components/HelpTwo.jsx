"use client";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";

const HelpTwo = () => {
  return (
    <section className='help-two'>
      <div className='container'>
        <div className='row'>
          <div className='col-12 col-lg-5 col-xxl-6 '>
            <div className='help-two__thumb d-none d-lg-block'>
              <div className='help-two__thumb-inner'>
                <div
                  className='thumb-lg'
                  data-aos='fade-up'
                  data-aos-duration={1000}
                >
                  <img src='assets/images/help/three.png' alt='Image_inner' />
                </div>
                <div
                  className='thumb-sm'
                  data-aos='fade-right'
                  data-aos-duration={1000}
                  data-aos-delay={100}
                >
                  <img src='assets/images/help/two.png' alt='Image_inner' />
                </div>
                <div
                  className='thumb-md'
                  data-aos='fade-left'
                  data-aos-duration={1000}
                  data-aos-delay={200}
                >
                  <img src='assets/images/help/one.png' alt='Image_inner' />
                </div>
                <div className='help-two__thumb-content'>
                  <div className='thumb'>
                    <i className='icon-donation' />
                  </div>
                  <div className='content'>
                    <h2>
                      <TrackVisibility once>
                        {({ isVisible }) =>
                          isVisible && (
                            <span className='odometer'>
                              <CountUp delay={0} start={0} end={250} />
                              <span className='prefix'>+</span>
                            </span>
                          )
                        }
                      </TrackVisibility>
                    </h2>
                    <p>Services we Provide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-7 col-xxl-6'>
            <div className='help-two__content'>
              <div className='section__content'>
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
                  communication, project
                </p>
              </div>
              <div className='help-two__inner cta'>
                <div className='help-two__inner-content'>
                  <div className='help__content-icon-group'>
                    <div className='help__content-icon'>
                      <div className='thumb'>
                        <i className='icon-make-donation' />
                      </div>
                      <div className='content'>
                        <h6>Start helping them</h6>
                        <p>
                          Raising awareness about the charity's mission and
                          cause.
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className='help__content-icon'>
                      <div className='thumb'>
                        <i className='icon-support-heart' />
                      </div>
                      <div className='content'>
                        <h6>Make Donations</h6>
                        <p>
                          Raising awareness about the charity's mission and
                          cause.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='help__content-list'>
                    <ul>
                      <li>
                        <i className='fa-solid fa-circle-check' /> Helped fund
                        3,265 Project powerfull
                      </li>
                      <li>
                        <i className='fa-solid fa-circle-check' /> We give child
                        a gift of a education
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='help-two-card-wrapper'>
                  <div className='help-two__card van-tilt'>
                    <div className='help-card-thumb'>
                      <img
                        src='assets/images/help/author.png'
                        alt='Image_inner'
                      />
                      <i className='icon-star' />
                    </div>
                    <div className='help-card-content'>
                      <h4>35,734</h4>
                      <h6>Helped Fund</h6>
                      <p>Quisque dignissim enim diam</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpTwo;
