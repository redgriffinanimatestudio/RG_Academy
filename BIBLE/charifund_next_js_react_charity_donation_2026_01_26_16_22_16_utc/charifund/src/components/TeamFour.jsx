import Link from "next/link";

const TeamFour = () => {
  return (
    <section className='team fc-team'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10 col-xl-6'>
            <div
              className='section__header text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <span className='sub-title'>We are always open for children</span>
              <h2 className='title-animation_inner mt-0'>
                Meet Our Volunteers
              </h2>
            </div>
          </div>
        </div>
        <div className='row gutter-40'>
          <div className='col-12 col-sm-6 col-xl-3'>
            <div
              className='team__single-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='team__single van-tilt'>
                <div className='team__single-thumb'>
                  <Link href='/team-details'>
                    <img src='assets/images/team/one.png' alt='Image_inner' />
                  </Link>
                  <div className='team__icons'>
                    <div className='team__single-content__icon'>
                      <i className='fa-solid fa-plus' />
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
                <div className='team__single-content'>
                  <h6>
                    <Link href='/team-details'>Michel Fokluz</Link>
                  </h6>
                  <p>Volunteer</p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-sm-6 col-xl-3'>
            <div
              className='team__single-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={300}
            >
              <div className='team__single van-tilt'>
                <div className='team__single-thumb'>
                  <Link href='/team-details'>
                    <img src='assets/images/team/two.png' alt='Image_inner' />
                  </Link>
                  <div className='team__icons'>
                    <div className='team__single-content__icon'>
                      <i className='fa-solid fa-plus' />
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
                <div className='team__single-content'>
                  <h6>
                    <Link href='/team-details'>Arian Drobloas</Link>
                  </h6>
                  <p>Volunteer</p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-sm-6 col-xl-3'>
            <div
              className='team__single-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={600}
            >
              <div className='team__single van-tilt'>
                <div className='team__single-thumb'>
                  <Link href='/team-details'>
                    <img src='assets/images/team/three.png' alt='Image_inner' />
                  </Link>
                  <div className='team__icons'>
                    <div className='team__single-content__icon'>
                      <i className='fa-solid fa-plus' />
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
                <div className='team__single-content'>
                  <h6>
                    <Link href='/team-details'>Jara Klintof</Link>
                  </h6>
                  <p>Volunteer</p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-sm-6 col-xl-3'>
            <div
              className='team__single-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={900}
            >
              <div className='team__single-alt text-center van-tilt'>
                <div className='thumb'>
                  <i className='icon-support-hand' />
                </div>
                <h5 className='fw-7'>Become a Volunteer</h5>
                <p>
                  Centuries but also the leap electtypesetting, remaining
                  exchange the.
                </p>
                <Link
                  href='/become-volunteer'
                  aria-label='join us'
                  title='join us'
                >
                  Join Us Today
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <div className='section__cta mt-60 text-center'>
              <Link
                href='/our-team'
                aria-label='our team'
                title='our team'
                className='btn--primary'
              >
                Become A Volunteer
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='spade'>
        <img src='assets/images/sprade-green.png' alt='Image_inner' />
      </div>
      <div className='spade-two'>
        <img
          src='assets/images/blog/spade-base.png'
          alt='Image_inner'
          className='base-img'
        />
      </div>
    </section>
  );
};

export default TeamFour;
