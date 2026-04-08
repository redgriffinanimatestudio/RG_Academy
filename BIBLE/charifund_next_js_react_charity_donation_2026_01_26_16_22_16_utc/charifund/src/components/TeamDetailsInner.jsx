import Link from "next/link";

const TeamDetailsInner = () => {
  return (
    <section className='team-details'>
      <div className='container'>
        <div className='row gutter-40 align-items-center'>
          <div className='col-12 col-lg-6 col-xl-5'>
            <div
              className='team-details__thumb'
              data-aos='zoom-in'
              data-aos-duration={1000}
            >
              <img src='assets/images/team/thumb.png' alt='Image_inner' />
            </div>
          </div>
          <div className='col-12 col-lg-6 col-xl-7'>
            <div
              className='team-details__content'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={100}
            >
              <div className='team-details__meta'>
                <h4 className='title-animation_inner'>George Clooney</h4>
                <p className='designation'>Volunteer</p>
                <div className='social'>
                  <a
                    href='https://www.facebook.com/'
                    target='_blank'
                    aria-label='share us on facebook'
                    title='facebook'
                    rel='noreferrer'
                  >
                    <i className='fa-brands fa-facebook-f' />
                  </a>
                  <a
                    href='https://vimeo.com/'
                    target='_blank'
                    aria-label='share us on vimeo'
                    title='vimeo'
                    rel='noreferrer'
                  >
                    <i className='fa-brands fa-vimeo-v' />
                  </a>
                  <a
                    href='https://x.com/'
                    target='_blank'
                    aria-label='share us on twitter'
                    title='twitter'
                    rel='noreferrer'
                  >
                    <i className='fa-brands fa-twitter' />
                  </a>
                  <a
                    href='https://www.linkedin.com/'
                    target='_blank'
                    aria-label='share us on linkedin'
                    title='linkedin'
                    rel='noreferrer'
                  >
                    <i className='fa-brands fa-linkedin-in' />
                  </a>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, con adipiscing elit tiam convallis
                  elit id impedie. Quisq commodo simply free ornare tortor. If
                  you are going to use a passage.
                </p>
              </div>
              <div className='my-word'>
                <h5>I Help my Clients Stand out And They Help me Grow.</h5>
              </div>
              <div className='progress-wrapper'>
                <div className='cause__progress progress-bar-single'>
                  <div className='cause-progress__bar'>
                    <p>Donation Collect</p>
                    <div className='progress-bar-wrapper' data-percent='70%'>
                      <div className='progress-bar'>
                        <div
                          className='progress-bar-percent'
                          style={{ width: "70%" }}
                        >
                          <span className='percent-value'>70%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='cause__progress progress-bar-single'>
                  <div className='cause-progress__bar'>
                    <p>Successful Events</p>
                    <div className='progress-bar-wrapper' data-percent='85%'>
                      <div className='progress-bar'>
                        <div
                          className='progress-bar-percent'
                          style={{ width: "85%" }}
                        >
                          <span className='percent-value'>85%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='team-details__list'>
                <ul>
                  <li>
                    <i className='icon-circle-check' />
                    Best Quality Services
                  </li>
                  <li>
                    <i className='icon-circle-check' />
                    Time Saving
                  </li>
                  <li>
                    <i className='icon-circle-check' />
                    Meet the Deadlines
                  </li>
                  <li>
                    <i className='icon-circle-check' />
                    24/7 Customer Support
                  </li>
                </ul>
              </div>
              <div className='team-details__cta cta'>
                <Link
                  href='/donate-us'
                  aria-label='make a donation'
                  title='make a donation'
                  className='btn--primary'
                >
                  {" "}
                  Donate With Me <i className='fa-solid fa-arrow-right' />
                </Link>
              </div>
            </div>
          </div>
          <div className='col-12'>
            <div
              className='about-me'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={100}
            >
              <h4 className='title-animation_inner'>About Me</h4>
              <p>
                This category focuses on the design construction of buildings
                and the This a category focuses on the design and construction
                of buildings This category a focuses on the design construction
                of buildings and the This a category of thfocuses on the design
                This category focuses on the design construction of buildings
                and the This a category focuses on the design and construction
                of buildings This category a focuses on the design construction
                of buildings and the This a category of thfocuses on the design
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamDetailsInner;
