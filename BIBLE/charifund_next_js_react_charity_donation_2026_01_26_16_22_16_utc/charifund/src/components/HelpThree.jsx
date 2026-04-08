import Link from "next/link";

const HelpThree = () => {
  return (
    <section className='help-three'>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div className='help-three__inner'>
              <div
                className='section__header-secondary'
                data-aos='fade-up'
                data-aos-duration={1000}
              >
                <div className='row gutter-30 align-items-center'>
                  <div className='col-12 col-lg-8 col-xxl-7'>
                    <div className='section__header mb-0'>
                      <span className='sub-title'>
                        <i className='icon-donation' />
                        Start donating poor people
                      </span>
                      <h2 className='title-animation_inner'>
                        Helping each other can make <span>world</span> better
                      </h2>
                    </div>
                  </div>
                  <div className='col-12 col-lg-4 col-xxl-5'>
                    <div className='help-cta'>
                      <Link
                        href='/about-us'
                        aria-label='our team'
                        title='our team'
                        className='btn--primary'
                      >
                        More About Us
                        <i className='fa-solid fa-arrow-right' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className='help-three__wrapper'>
                <div className='row gutter-60'>
                  <div className='col-12 col-md-6 col-xxl-3'>
                    <div
                      className='help-three__single'
                      data-aos='fade-up'
                      data-aos-duration={1000}
                    >
                      <div className='help-three__thumb'>
                        <div className='thumb'>
                          <i className='icon-pack' />
                        </div>
                        <div className='help-three__tag'>
                          <h6>Step - 01</h6>
                        </div>
                      </div>
                      <div className='help-three__content'>
                        <h6>Select Services</h6>
                        <p>
                          Pellentesque habitant morbi trist fames ac turp
                          egestas. Aliquam enim feugiat mattis.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='col-12 col-md-6 col-xxl-3'>
                    <div
                      className='help-three__single'
                      data-aos='fade-up'
                      data-aos-duration={1000}
                      data-aos-delay={300}
                    >
                      <div className='help-three__thumb'>
                        <div className='thumb'>
                          <i className='icon-credit-card' />
                        </div>
                        <div className='help-three__tag'>
                          <h6>Step - 02</h6>
                        </div>
                      </div>
                      <div className='help-three__content'>
                        <h6>Percel Information</h6>
                        <p>
                          Pellentesque habitant morbi trist fames ac turp
                          egestas. Aliquam enim feugiat mattis.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='col-12 col-md-6 col-xxl-3'>
                    <div
                      className='help-three__single'
                      data-aos='fade-up'
                      data-aos-duration={1000}
                      data-aos-delay={600}
                    >
                      <div className='help-three__thumb'>
                        <div className='thumb'>
                          <i className='icon-ship' />
                        </div>
                        <div className='help-three__tag'>
                          <h6>Step - 03</h6>
                        </div>
                      </div>
                      <div className='help-three__content'>
                        <h6>Transportation</h6>
                        <p>
                          Pellentesque habitant morbi trist fames ac turp
                          egestas. Aliquam enim feugiat mattis.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='col-12 col-md-6 col-xxl-3'>
                    <div
                      className='help-three__single'
                      data-aos='fade-up'
                      data-aos-duration={1000}
                      data-aos-delay={900}
                    >
                      <div className='help-three__thumb'>
                        <div className='thumb'>
                          <i className='icon-truck' />
                        </div>
                        <div className='help-three__tag'>
                          <h6>Step - 04</h6>
                        </div>
                      </div>
                      <div className='help-three__content'>
                        <h6>Takeover Products</h6>
                        <p>
                          Pellentesque habitant morbi trist fames ac turp
                          egestas. Aliquam enim feugiat mattis.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <img
                  src='assets/images/v-line.png'
                  alt='Image_inner'
                  className='v-line d-none d-xxl-block'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className='help-three-bg'
        data-aos='fade-up'
        data-aos-duration={1000}
        data-aos-delay={300}
      >
        <img
          src='assets/images/bg-one.png'
          alt='Image_inner'
          className='bg-help'
        />
        <div className='poor-boy'>
          <img
            src='assets/images/poor-boy.png'
            alt='Image_inner'
            className='poor'
          />
          <img
            src='assets/images/shape-three.png'
            alt='Image_inner'
            className='shape'
          />
        </div>
        <div className='parasuit'>
          <img src='assets/images/parasuit.png' alt='Image_inner' />
        </div>
      </div>
    </section>
  );
};

export default HelpThree;
