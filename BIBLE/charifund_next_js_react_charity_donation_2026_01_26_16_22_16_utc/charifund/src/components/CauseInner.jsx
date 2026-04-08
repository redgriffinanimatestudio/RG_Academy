import Link from "next/link";
import ProgressBar from "../helper/ProgressBar";

const CauseInner = () => {
  return (
    <section className='cause cause-three-alt'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-xl-7'>
            <div
              className='section__header mb-60 text-center'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <span className='sub-title'>
                <i className='icon-donation' />
                Start donating poor people
              </span>
              <h2 className='title-animation_inner'>
                Be the reason of someone
                <span>smiles</span> Causes
              </h2>
            </div>
          </div>
        </div>
        <div className='row gutter-30'>
          <div className='col-12 col-md-6 col-xl-4 col-xxl-3'>
            <div
              className='cause__slider-inner'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='cause__slider-single van-tilt'>
                <div className='thumb'>
                  <Link href='/cause-details'>
                    <img src='assets/images/cause/one.png' alt='Image_inner' />
                  </Link>
                  <div className='tag'>
                    <Link href='/our-causes'>Health</Link>
                  </div>
                </div>
                <div className='content'>
                  <h6>
                    <Link href='/cause-details'>Children we work with</Link>
                  </h6>
                  <p>
                    Lorem ipsum dolor sit amet, consete sadipscing elitr, sed
                    diam nonum
                  </p>
                </div>
                <div className='cause__slider-cta'>
                  <div className='cause__progress progress-bar-single'>
                    {/* ProgressBar */}
                    <ProgressBar percent={85} />
                    {/* ProgressBar */}
                    <div className='cause-progress__goal'>
                      <p>
                        Raised: <span className='raised'>$8500</span>
                      </p>
                      <p>
                        Goal: <span className='goal'>$1,0000</span>
                      </p>
                    </div>
                  </div>
                  <div className='cause__cta'>
                    <Link
                      href='/donate-us'
                      aria-label='donate now'
                      title='donate now'
                      className='btn--secondary'
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4 col-xxl-3'>
            <div
              className='cause__slider-inner'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={300}
            >
              <div className='cause__slider-single van-tilt'>
                <div className='thumb'>
                  <Link href='/cause-details'>
                    <img src='assets/images/cause/two.png' alt='Image_inner' />
                  </Link>
                  <div className='tag'>
                    <Link href='/our-causes'>Food</Link>
                  </div>
                </div>
                <div className='content'>
                  <h6>
                    <Link href='/cause-details'>Help For Education</Link>
                  </h6>
                  <p>
                    Lorem ipsum dolor sit amet, consete sadipscing elitr, sed
                    diam nonum
                  </p>
                </div>
                <div className='cause__slider-cta'>
                  <div className='cause__progress progress-bar-single'>
                    {/* ProgressBar */}
                    <ProgressBar percent={70} />
                    {/* ProgressBar */}
                    <div className='cause-progress__goal'>
                      <p>
                        Raised: <span className='raised'>$8500</span>
                      </p>
                      <p>
                        Goal: <span className='goal'>$1,0000</span>
                      </p>
                    </div>
                  </div>
                  <div className='cause__cta'>
                    <Link
                      href='/donate-us'
                      aria-label='donate now'
                      title='donate now'
                      className='btn--secondary'
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4 col-xxl-3'>
            <div
              className='cause__slider-inner'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={600}
            >
              <div className='cause__slider-single van-tilt'>
                <div className='thumb'>
                  <Link href='/cause-details'>
                    <img
                      src='assets/images/cause/three.png'
                      alt='Image_inner'
                    />
                  </Link>
                  <div className='tag'>
                    <Link href='/our-causes'>Health</Link>
                  </div>
                </div>
                <div className='content'>
                  <h6>
                    <Link href='/cause-details'>Help For Food</Link>
                  </h6>
                  <p>
                    Lorem ipsum dolor sit amet, consete sadipscing elitr, sed
                    diam nonum
                  </p>
                </div>
                <div className='cause__slider-cta'>
                  <div className='cause__progress progress-bar-single'>
                    {/* ProgressBar */}
                    <ProgressBar percent={65} />
                    {/* ProgressBar */}
                    <div className='cause-progress__goal'>
                      <p>
                        Raised: <span className='raised'>$8500</span>
                      </p>
                      <p>
                        Goal: <span className='goal'>$1,0000</span>
                      </p>
                    </div>
                  </div>
                  <div className='cause__cta'>
                    <Link
                      href='/donate-us'
                      aria-label='donate now'
                      title='donate now'
                      className='btn--secondary'
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4 col-xxl-3'>
            <div
              className='cause__slider-inner'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={900}
            >
              <div className='cause__slider-single van-tilt'>
                <div className='thumb'>
                  <Link href='/cause-details'>
                    <img src='assets/images/cause/four.png' alt='Image_inner' />
                  </Link>
                  <div className='tag'>
                    <Link href='/our-causes'>Food</Link>
                  </div>
                </div>
                <div className='content'>
                  <h6>
                    <Link href='/cause-details'>Give health support</Link>
                  </h6>
                  <p>
                    Lorem ipsum dolor sit amet, consete sadipscing elitr, sed
                    diam nonum
                  </p>
                </div>
                <div className='cause__slider-cta'>
                  <div className='cause__progress progress-bar-single'>
                    {/* ProgressBar */}
                    <ProgressBar percent={90} />
                    {/* ProgressBar */}
                    <div className='cause-progress__goal'>
                      <p>
                        Raised: <span className='raised'>$8500</span>
                      </p>
                      <p>
                        Goal: <span className='goal'>$1,0000</span>
                      </p>
                    </div>
                  </div>
                  <div className='cause__cta'>
                    <Link
                      href='/donate-us'
                      aria-label='donate now'
                      title='donate now'
                      className='btn--secondary'
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4 col-xxl-3'>
            <div
              className='cause__slider-inner'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <div className='cause__slider-single van-tilt'>
                <div className='thumb'>
                  <Link href='/cause-details'>
                    <img src='assets/images/cause/one.png' alt='Image_inner' />
                  </Link>
                  <div className='tag'>
                    <Link href='/our-causes'>Health</Link>
                  </div>
                </div>
                <div className='content'>
                  <h6>
                    <Link href='/cause-details'>Children we work with</Link>
                  </h6>
                  <p>
                    Lorem ipsum dolor sit amet, consete sadipscing elitr, sed
                    diam nonum
                  </p>
                </div>
                <div className='cause__slider-cta'>
                  <div className='cause__progress progress-bar-single'>
                    {/* ProgressBar */}
                    <ProgressBar percent={75} />
                    {/* ProgressBar */}
                    <div className='cause-progress__goal'>
                      <p>
                        Raised: <span className='raised'>$8500</span>
                      </p>
                      <p>
                        Goal: <span className='goal'>$1,0000</span>
                      </p>
                    </div>
                  </div>
                  <div className='cause__cta'>
                    <Link
                      href='/donate-us'
                      aria-label='donate now'
                      title='donate now'
                      className='btn--secondary'
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4 col-xxl-3'>
            <div
              className='cause__slider-inner'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={300}
            >
              <div className='cause__slider-single van-tilt'>
                <div className='thumb'>
                  <Link href='/cause-details'>
                    <img src='assets/images/cause/two.png' alt='Image_inner' />
                  </Link>
                  <div className='tag'>
                    <Link href='/our-causes'>Food</Link>
                  </div>
                </div>
                <div className='content'>
                  <h6>
                    <Link href='/cause-details'>Help For Education</Link>
                  </h6>
                  <p>
                    Lorem ipsum dolor sit amet, consete sadipscing elitr, sed
                    diam nonum
                  </p>
                </div>
                <div className='cause__slider-cta'>
                  <div className='cause__progress progress-bar-single'>
                    {/* ProgressBar */}
                    <ProgressBar percent={65} />
                    {/* ProgressBar */}
                    <div className='cause-progress__goal'>
                      <p>
                        Raised: <span className='raised'>$8500</span>
                      </p>
                      <p>
                        Goal: <span className='goal'>$1,0000</span>
                      </p>
                    </div>
                  </div>
                  <div className='cause__cta'>
                    <Link
                      href='/donate-us'
                      aria-label='donate now'
                      title='donate now'
                      className='btn--secondary'
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4 col-xxl-3'>
            <div
              className='cause__slider-inner'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={600}
            >
              <div className='cause__slider-single van-tilt'>
                <div className='thumb'>
                  <Link href='/cause-details'>
                    <img
                      src='assets/images/cause/three.png'
                      alt='Image_inner'
                    />
                  </Link>
                  <div className='tag'>
                    <Link href='/our-causes'>Health</Link>
                  </div>
                </div>
                <div className='content'>
                  <h6>
                    <Link href='/cause-details'>Help For Food</Link>
                  </h6>
                  <p>
                    Lorem ipsum dolor sit amet, consete sadipscing elitr, sed
                    diam nonum
                  </p>
                </div>
                <div className='cause__slider-cta'>
                  <div className='cause__progress progress-bar-single'>
                    {/* ProgressBar */}
                    <ProgressBar percent={90} />
                    {/* ProgressBar */}
                    <div className='cause-progress__goal'>
                      <p>
                        Raised: <span className='raised'>$8500</span>
                      </p>
                      <p>
                        Goal: <span className='goal'>$1,0000</span>
                      </p>
                    </div>
                  </div>
                  <div className='cause__cta'>
                    <Link
                      href='/donate-us'
                      aria-label='donate now'
                      title='donate now'
                      className='btn--secondary'
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4 col-xxl-3'>
            <div
              className='cause__slider-inner'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={900}
            >
              <div className='cause__slider-single van-tilt'>
                <div className='thumb'>
                  <Link href='/cause-details'>
                    <img src='assets/images/cause/four.png' alt='Image_inner' />
                  </Link>
                  <div className='tag'>
                    <Link href='/our-causes'>Food</Link>
                  </div>
                </div>
                <div className='content'>
                  <h6>
                    <Link href='/cause-details'>Give health support</Link>
                  </h6>
                  <p>
                    Lorem ipsum dolor sit amet, consete sadipscing elitr, sed
                    diam nonum
                  </p>
                </div>
                <div className='cause__slider-cta'>
                  <div className='cause__progress progress-bar-single'>
                    {/* ProgressBar */}
                    <ProgressBar percent={55} />
                    {/* ProgressBar */}
                    <div className='cause-progress__goal'>
                      <p>
                        Raised: <span className='raised'>$8500</span>
                      </p>
                      <p>
                        Goal: <span className='goal'>$1,0000</span>
                      </p>
                    </div>
                  </div>
                  <div className='cause__cta'>
                    <Link
                      href='/donate-us'
                      aria-label='donate now'
                      title='donate now'
                      className='btn--secondary'
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <div
              className='pagination-wrapper'
              data-aos='fade-up'
              data-aos-duration={1000}
            >
              <ul className='pagination main-pagination'>
                <li>
                  <button>
                    <i className='fa-solid fa-angles-left' />
                  </button>
                </li>
                <li>
                  <Link href='/blog-list'>1</Link>
                </li>
                <li>
                  <Link href='/blog-list' className='active'>
                    2
                  </Link>
                </li>
                <li>
                  <Link href='/blog-list'>3</Link>
                </li>
                <li>
                  <button>
                    <i className='fa-solid fa-angles-right' />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className='spade'>
        <img src='assets/images/help/spade.png' alt='Image_inner' />
      </div>
    </section>
  );
};

export default CauseInner;
