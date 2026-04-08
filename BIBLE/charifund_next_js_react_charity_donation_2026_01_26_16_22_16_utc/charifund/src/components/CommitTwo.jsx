"use client";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
import Link from "next/link";
const CommitTwo = () => {
  return (
    <section className='commit help-two ff-commit pt-120 pb-120'>
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
              <div className='vertical-text'>
                <h5>
                  We Give <span>Donations</span> to Poor People{" "}
                </h5>
              </div>
            </div>
          </div>
          <div className='col-12 col-lg-7 col-xl-7'>
            <div className='help-two__content'>
              <div className='section__content'>
                <span className='sub-title'>
                  We are always open for children
                </span>
                <h2 className='title-animation_inner mt-0'>
                  Helping each other can make world better
                </h2>
                <p className='text-gr-2'>
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
                        <h6 className='fw-5'>Start helping them</h6>
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
                        <h6 className='fw-5'>Make Donations</h6>
                        <p>
                          Raising awareness about the charity's mission and
                          cause.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='cta'>
                    <Link
                      href='/our-causes'
                      aria-label='check causes'
                      title='check causes'
                      className='btn--primary'
                    >
                      Check Our Causes
                    </Link>
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
      <div className='fc-two'>
        <img src='assets/images/fc-nine.png' alt='Image_inner' />
      </div>
    </section>
  );
};

export default CommitTwo;
