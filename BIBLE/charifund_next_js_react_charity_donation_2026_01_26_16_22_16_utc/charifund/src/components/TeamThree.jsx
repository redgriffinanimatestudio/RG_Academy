import Link from "next/link";

const TeamThree = () => {
  return (
    <section className='team-three'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10 col-xl-6'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <span className='sub-title'>
                <i className='icon-donation' />
                Start donating poor people
              </span>
              <h2 className='title-animation_inner'>
                Meet Our Volunteer
                <span>Team</span> members
              </h2>
            </div>
          </div>
        </div>
        <div className='row gutter-40'>
          <div className='col-12 col-md-6 col-xl-4'>
            <div
              className='team__single-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='team__single van-tilt'>
                <div className='team__single-thumb'>
                  <Link href='/team-details'>
                    <img src='/assets/images/team/five.png' alt='Image_inner' />
                  </Link>
                </div>
                <div className='team__content-wrapper'>
                  <div className='team__single-content'>
                    <h5>
                      <Link href='/team-details'>Michel Fokluz</Link>
                    </h5>
                    <p>Software Engineer</p>
                  </div>
                  <div className='team__icons'>
                    <div className='team__single-content__icon'>
                      <i className='icon-share' />
                    </div>
                    <div className='team__single__thumb-social'>
                      <ul>
                        <li>
                          <Link href='/'>
                            <i className='fa-brands fa-facebook-f' />
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <i className='fa-brands fa-twitter' />
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <i className='fa-brands fa-instagram' />
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <i className='fa-brands fa-behance' />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div
              className='team__single-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={300}
            >
              <div className='team__single van-tilt'>
                <div className='team__single-thumb'>
                  <Link href='/team-details'>
                    <img src='/assets/images/team/six.png' alt='Image_inner' />
                  </Link>
                </div>
                <div className='team__content-wrapper'>
                  <div className='team__single-content'>
                    <h5>
                      <Link href='/team-details'>Jara Kroft</Link>
                    </h5>
                    <p>Front End Engineer</p>
                  </div>
                  <div className='team__icons'>
                    <div className='team__single-content__icon'>
                      <i className='icon-share' />
                    </div>
                    <div className='team__single__thumb-social'>
                      <ul>
                        <li>
                          <Link href='/'>
                            <i className='fa-brands fa-facebook-f' />
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <i className='fa-brands fa-twitter' />
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <i className='fa-brands fa-instagram' />
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <i className='fa-brands fa-behance' />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div
              className='team__single-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={600}
            >
              <div className='team__single van-tilt'>
                <div className='team__single-thumb'>
                  <Link href='/team-details'>
                    <img
                      src='/assets/images/team/seven.png'
                      alt='Image_inner'
                    />
                  </Link>
                </div>
                <div className='team__content-wrapper'>
                  <div className='team__single-content'>
                    <h5>
                      <Link href='/team-details'>Billu Devis</Link>
                    </h5>
                    <p>Operations Manager</p>
                  </div>
                  <div className='team__icons'>
                    <div className='team__single-content__icon'>
                      <i className='icon-share' />
                    </div>
                    <div className='team__single__thumb-social'>
                      <ul>
                        <li>
                          <Link href='/'>
                            <i className='fa-brands fa-facebook-f' />
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <i className='fa-brands fa-twitter' />
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <i className='fa-brands fa-instagram' />
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <i className='fa-brands fa-behance' />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <div className='section__cta cta text-center'>
              <Link
                href='/our-team'
                aria-label='our team'
                title='our team'
                className='btn--primary'
              >
                View All
                <i className='fa-solid fa-arrow-right' />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='spade'>
        <img src='/assets/images/sprade-green.png' alt='Image_inner' />
      </div>
    </section>
  );
};

export default TeamThree;
