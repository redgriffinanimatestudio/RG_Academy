import Link from "next/link";

const FooterThree = () => {
  return (
    <footer className='footer-three'>
      <div className='container'>
        <div className='row gutter-30'>
          <div className='col-12 col-lg-3'>
            <div
              className='footer-three__logo'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <Link href='/'>
                <img src='/assets/images/logo-light.png' alt='Image_inner' />
              </Link>
            </div>
          </div>
          <div className='col-12 col-lg-9'>
            <div
              className='footer-three__inner'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={300}
            >
              <div className='footer__bottom-left'>
                <ul className='footer__bottom-list justify-content-center justify-content-lg-end'>
                  <li>
                    <Link href='/contact-us'>Support</Link>
                  </li>
                  <li>
                    <Link href='/terms-conditions'>Terms &amp; Conditions</Link>
                  </li>
                  <li>
                    <Link href='/privacy-policy'>Privacy Policy</Link>
                  </li>
                </ul>
              </div>
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
      </div>
      <hr className='divider' />
      <div className='container'>
        <div className='row gutter-80'>
          <div className='col-12 col-md-6 col-xl-3'>
            <div
              className='footer-three__widget'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='footer-two__widget-intro'>
                <h5>About Us</h5>
              </div>
              <div className='footer-three__widget-single'>
                <p>
                  We believe it has the power to do amazing things together.
                </p>
                <p>
                  <a href='mailto:support@example.com'>example@email.com</a>
                </p>
              </div>
              <div className='footer-three__widget-alt'>
                <div className='footer-two__widget-intro'>
                  <h6>Opening Hours</h6>
                </div>
                <div className='footer-three__widget-single'>
                  <p>9.30am - 6.30pm</p>
                  <p>Monday to Friday</p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-3'>
            <div
              className='footer-three__widget'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={200}
            >
              <div className='footer-two__widget-intro'>
                <h5>Latest Post</h5>
              </div>
              <div className='footer-three__widget-content'>
                <div className='footer-three__widget-news'>
                  <div className='thumb'>
                    <Link href='/blog-details'>
                      <img
                        src='/assets/images/blog/ph-one.png'
                        alt='Image_inner'
                      />
                    </Link>
                  </div>
                  <div className='content'>
                    <p>
                      <i className='fa-solid fa-calendar' />
                      24th May 2023
                    </p>
                    <p>
                      <Link href='/blog-details'>
                        This Place Really Place For Awesome
                      </Link>
                    </p>
                  </div>
                </div>
                <div className='footer-three__widget-news'>
                  <div className='thumb'>
                    <Link href='/blog-details'>
                      <img
                        src='/assets/images/blog/ph-two.png'
                        alt='Image_inner'
                      />
                    </Link>
                  </div>
                  <div className='content'>
                    <p>
                      <i className='fa-solid fa-calendar' />
                      24th May 2023
                    </p>
                    <p>
                      <Link href='/blog-details'>
                        This Place Really Place For Awesome
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-3'>
            <div
              className='footer-three__widget footer-three__widget-alter'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={400}
            >
              <div className='footer-two__widget-intro'>
                <h5>Get In Touch</h5>
              </div>
              <div className='footer-three__widget-content'>
                <div className='single-address'>
                  <div className='thumb'>
                    <i className='fa-solid fa-location-dot' />
                  </div>
                  <div className='content'>
                    <p>Address</p>
                    <p>
                      <a
                        href='https://maps.app.goo.gl/Gr9pTNqz5FRNrjQw8'
                        target='_blank'
                        rel='noreferrer'
                      >
                        244, First Floor, 11 St Roots Terrace, Los Angeles
                      </a>
                    </p>
                  </div>
                </div>
                <div className='single-address'>
                  <div className='thumb'>
                    <i className='fa-solid fa-phone' />
                  </div>
                  <div className='content'>
                    <p>Phone</p>
                    <p>
                      <a href='tel:2305-587-3407'>+088 (246) 642-27-10</a>
                    </p>
                  </div>
                </div>
                <div className='single-address'>
                  <div className='thumb'>
                    <i className='fa-regular fa-envelope' />
                  </div>
                  <div className='content'>
                    <p>Email</p>
                    <p>
                      <a href='mailto:support@example.com'>example@email.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-3'>
            <div
              className='footer-three__widget footer-three__widget--newsletter'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={600}
            >
              <div className='footer-two__widget-intro'>
                <h5>Newsletter</h5>
              </div>
              <div className='footer-three__widget-content'>
                <p>
                  Indignation and dislike men who are so beguiled and
                  demoralized by
                </p>
                <form action='#' method='post'>
                  <div className='input-icon'>
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
                    >
                      <i className='fa-solid fa-paper-plane' />
                    </button>
                  </div>
                  <div className='footer__newsletter-check'>
                    <div className='form-group'>
                      <input type='checkbox' id='acceptPolicy' />
                      <label htmlFor='acceptPolicy'>
                        I agree all your{" "}
                        <Link href='/terms-conditions'>Terms</Link> &amp;
                        <Link href='/privacy-policy'>Policies</Link>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='footer-two__copyright'>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <div className='footer-two__copyright-inner text-center'>
                <p>
                  Copyright © {new Date().getFullYear()}{" "}
                  <Link href='/'>Charifund</Link>. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterThree;
