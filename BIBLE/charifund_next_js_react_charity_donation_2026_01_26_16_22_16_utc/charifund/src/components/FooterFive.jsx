import Link from "next/link";

const FooterFive = () => {
  return (
    <footer className='footer-two ff-footer'>
      <div className='container'>
        <div className='row align-items-center gutter-30'>
          <div className='col-12 col-lg-7 col-xxl-6'>
            <div className='footer-two__newsletter-content'>
              <h3 className='title-animation_inner'>
                Subscribe to Our Newsletter
              </h3>
              <p>Regular inspections and feedback mechanisms</p>
            </div>
          </div>
          <div className='col-12 col-lg-5 col-xxl-5 offset-xxl-1'>
            <div className='footer-two__newsletter-form'>
              <form>
                <input
                  type='email'
                  required=''
                  name='subscribe-email'
                  id='subscribeEmail'
                  placeholder='Enter Email'
                />
                <button
                  type='submit'
                  aria-label='subscribe to our newsletter'
                  title='subscribe to our newsletter'
                  className='btn--primary'
                >
                  {" "}
                  <i className='fa-solid fa-paper-plane' />
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <hr className='divider' />
          </div>
        </div>
        <div className='row gutter-60'>
          <div className='col-12 col-md-6 col-xl-3'>
            <div
              className='footer-two__widget'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='footer-two__widget-logo'>
                <Link href='/'>
                  <img
                    src='assets/images/logo-two-light.png'
                    alt='Image_inner'
                  />
                </Link>
              </div>
              <div className='footer-two__widget-content'>
                <p>
                  Our secure online donation platform allows you to make
                  contributions quickly and safely.
                </p>
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
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-2 offset-xl-1'>
            <div
              className='footer-two__widget'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={200}
            >
              <div className='footer-two__widget-intro'>
                <h5>Quick Links</h5>
                <div className='line'>
                  <span className='large-line' />
                  <span className='small-line' />
                  <span className='small-line' />
                </div>
              </div>
              <div className='footer-two__widget-content'>
                <ul>
                  <li>
                    <Link href='/about-us'>
                      <i className='fa-solid fa-arrow-right' />
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href='/blog-list'>
                      <i className='fa-solid fa-arrow-right' />
                      Our News
                    </Link>
                  </li>
                  <li>
                    <Link href='/our-causes'>
                      <i className='fa-solid fa-arrow-right' />
                      Our Campaign
                    </Link>
                  </li>
                  <li>
                    <Link href='/faq'>
                      <i className='fa-solid fa-arrow-right' />
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href='/contact-us'>
                      <i className='fa-solid fa-arrow-right' />
                      Get A Quote
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-3'>
            <div
              className='footer-two__widget footer-two__widget--alternate'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={400}
            >
              <div className='footer-two__widget-intro'>
                <h5>Our Services</h5>
                <div className='line'>
                  <span className='large-line' />
                  <span className='small-line' />
                  <span className='small-line' />
                </div>
              </div>
              <div className='footer-two__widget-content'>
                <ul>
                  <li>
                    <Link href='/our-causes'>
                      <i className='fa-solid fa-arrow-right' />
                      Our Causes
                    </Link>
                  </li>
                  <li>
                    <Link href='/events'>
                      <i className='fa-solid fa-arrow-right' />
                      Education Support
                    </Link>
                  </li>
                  <li>
                    <Link href='/our-causes'>
                      <i className='fa-solid fa-arrow-right' />
                      Our Campaign
                    </Link>
                  </li>
                  <li>
                    <Link href='/our-causes'>
                      <i className='fa-solid fa-arrow-right' />
                      Food Support
                    </Link>
                  </li>
                  <li>
                    <Link href='/our-causes'>
                      <i className='fa-solid fa-arrow-right' />
                      Health Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-3'>
            <div
              className='footer-two__widget footer-two__widget--alternate'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={600}
            >
              <div className='footer-two__widget-intro'>
                <h5>Get In Touch</h5>
                <div className='line'>
                  <span className='large-line' />
                  <span className='small-line' />
                  <span className='small-line' />
                </div>
              </div>
              <div className='footer-two__widget-content footer-two__widget-content--contact'>
                <ul>
                  <li>
                    <a
                      href='https://maps.app.goo.gl/Gr9pTNqz5FRNrjQw8'
                      target='_blank'
                      rel='noreferrer'
                    >
                      <i className='fa-solid fa-location-dot' />
                      455 West Orchard Street Kings Mountain, NC 280867
                    </a>
                  </li>
                  <li>
                    <a href='tel:2305-587-3407'>
                      <i className='fa-solid fa-phone' />
                      +088 (246) 642-27-10
                    </a>
                  </li>
                  <li>
                    <a href='mailto:support@example.com'>
                      <i className='fa-regular fa-envelope' />
                      example@email.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='footer-two__copyright'>
        <div className='container'>
          <div className='row align-items-center gutter-12'>
            <div className='col-12 col-lg-6'>
              <div className='footer-two__copyright-inner text-center text-lg-start'>
                <p>
                  Copyright © {new Date().getFullYear()}{" "}
                  <Link href='/'>Charifund</Link>. All rights reserved.
                </p>
              </div>
            </div>
            <div className='col-12 col-lg-6'>
              <div className='footer__bottom-left'>
                <ul className='footer__bottom-list justify-content-center justify-content-lg-end'>
                  <li>
                    <Link href='/terms-conditions'>Terms &amp; Conditions</Link>
                  </li>
                  <li>
                    <Link href='/privacy-policy'>Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href='/privacy-policy'>Cookie Settings</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='sprade' data-aos='zoom-in' data-aos-duration={1000}>
        <img
          src='assets/images/sprade.png'
          alt='Image_inner'
          className='base-img'
        />
      </div>
      <div className='sprade-light' data-aos='zoom-in' data-aos-duration={1000}>
        <img src='assets/images/sprade-light.png' alt='Image_inner' />
      </div>
    </footer>
  );
};

export default FooterFive;
