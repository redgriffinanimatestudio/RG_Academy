import Link from "next/link";

const FooterTwo = () => {
  return (
    <footer className='footer'>
      <div className='footer__inner'>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <div className='footer__intro'>
                <div className='row align-items-center justify-content-center gutter-30'>
                  <div className='col-12 col-sm-8 col-lg-5 col-xl-6'>
                    <div className='footer__content'>
                      <h3 className='title-animation_inner'>
                        children need your help start <span>donating</span>{" "}
                        today
                      </h3>
                    </div>
                  </div>
                  <div className='col-12 col-lg-7 col-xl-6'>
                    <div
                      className='footer__support'
                      data-aos='fade-up'
                      data-aos-duration={1000}
                      data-aos-delay={300}
                    >
                      <Link href='/contact-us'>
                        for Any Inquiry <span>@WOWtheme.co</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row gutter-60'>
            <div className='col-12 col-xl-6'>
              <div
                className='footer__newsletter'
                data-aos='fade-up'
                data-aos-duration={1000}
              >
                <div className='footer__newsletter-info'>
                  <h4 className='title-animation_inner'>
                    Subscribe Newsletter
                  </h4>
                  <p>We understand that every challenge is an opportunity </p>
                </div>
                <div className='footer__newsletter-form'>
                  <form action='#' method='post'>
                    <div className='input-icon'>
                      <input
                        type='email'
                        required=''
                        name='subscribe-email'
                        id='subscribeEmail'
                        placeholder='Enter Email'
                      />
                      <i className='fa-regular fa-envelope' />
                    </div>
                    <button
                      type='submit'
                      aria-label='subscribe to our newsletter'
                      title='subscribe to our newsletter'
                      className='btn--primary'
                    >
                      Subscribe <i className='fa-solid fa-paper-plane' />
                    </button>
                  </form>
                </div>
                <div className='footer__newsletter-check'>
                  <div className='form-group'>
                    <input type='checkbox' id='acceptPolicy' />
                    <label htmlFor='acceptPolicy'>
                      By subscribing, you're accepting our{" "}
                      <Link href='/contact-us'>Privacy Policy</Link>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-md-6 col-xl-2 offset-xl-1'>
              <div
                className='footer__list'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={300}
              >
                <div className='footer__list-intro'>
                  <h5 className='title-animation_inner'>Services</h5>
                </div>
                <div className='footer__list-items'>
                  <ul>
                    <li>
                      <Link href='/about-us'>
                        <i className='fa-solid fa-angles-right' />
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href='/our-causes'>
                        <i className='fa-solid fa-angles-right' />
                        Our Causes
                      </Link>
                    </li>
                    <li>
                      <Link href='/our-team'>
                        <i className='fa-solid fa-angles-right' />
                        Our Teams
                      </Link>
                    </li>
                    <li>
                      <Link href='/blog-list'>
                        <i className='fa-solid fa-angles-right' />
                        Our Blog
                      </Link>
                    </li>
                    <li>
                      <Link href='/faq'>
                        <i className='fa-solid fa-angles-right' />
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link href='/contact-us'>
                        <i className='fa-solid fa-angles-right' />
                        Get A Quote
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='col-12 col-md-6 col-xl-3'>
              <div
                className='footer__list'
                data-aos='fade-up'
                data-aos-duration={1000}
                data-aos-delay={600}
              >
                <div className='footer__list-group'>
                  <div className='footer__list-intro'>
                    <h5 className='title-animation_inner'>Locations</h5>
                  </div>
                  <div className='content'>
                    <p>
                      <a
                        href='https://maps.app.goo.gl/Gr9pTNqz5FRNrjQw8'
                        target='_blank'
                        rel='noreferrer'
                      >
                        55 Main Street, 2nd block Malborne, Australia
                      </a>
                    </p>
                  </div>
                </div>
                <div className='footer__list-group'>
                  <div className='footer__list-intro'>
                    <h5 className='title-animation_inner'>Contact</h5>
                  </div>
                  <div className='content'>
                    <p>
                      <a href='mailto:support@example.com'>
                        support@example.com
                      </a>
                    </p>
                    <p>
                      <a href='tel:2305-587-3407'>+2(305) 587-3407</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='footer__copyright'>
            <div className='container'>
              <div className='row'>
                <div className='col-12'>
                  <div className='footer__copyright-inner'>
                    <div className='row align-items-center gutter-24'>
                      <div className='col-12 col-xl-3'>
                        <div className='footer__copyright-logo text-center text-xl-start'>
                          <Link href='/'>
                            <img
                              src='assets/images/logo-light.png'
                              alt='Image_inner'
                            />
                          </Link>
                        </div>
                      </div>
                      <div className='col-12 col-xl-6'>
                        <div className='footer__bottom-right text-center'>
                          <p>
                            Copyright © <span id='copyrightYear' />{" "}
                            <Link href='/' target='_blank'>
                              Charifund
                            </Link>
                            . All rights reserved.
                          </p>
                        </div>
                      </div>
                      <div className='col-12 col-xl-3'>
                        <div className='footer__bottom-left'>
                          <ul className='footer__bottom-list justify-content-center justify-content-xl-end'>
                            <li>
                              <Link href='/terms-conditions'>
                                Terms &amp; Conditions
                              </Link>
                            </li>
                            <li>
                              <Link href='/privacy-policy'>Privacy Policy</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterTwo;
