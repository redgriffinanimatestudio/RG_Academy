import Link from "next/link";

const CauseTwo = () => {
  return (
    <section className='cause fc-cause pt-120 pb-120'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-xl-7'>
            <div className='section__header text-center'>
              <span className='sub-title'>We are always open for children</span>
              <h2 className='title-animation_inner mt-0'>Our Recent Causes</h2>
            </div>
          </div>
        </div>
        <div className='row gutter-30 mt-60'>
          <div className='col-12 col-lg-6 col-xl-4'>
            <div className='cause__slider-single'>
              <div className='thumb'>
                <Link href='/cause-details'>
                  <img src='assets/images/cause/eight.png' alt='Image_inner' />
                </Link>
                <div className='tag'>
                  <Link href='/cause-details'>Health</Link>
                </div>
              </div>
              <div className='content'>
                <h6 className='fw-7'>
                  <Link href='/cause-details'>
                    It is a long established fact that a reader
                  </Link>
                </h6>
                <p>
                  Business is the activity of making one's buying and selling
                  product
                </p>
              </div>
              <div className='cause__slider-cta'>
                <div className='cause__progress progress-bar-single'>
                  <div className='cause-progress__intro'>
                    <p>
                      <span className='raised'>$25,294</span> raised of{" "}
                      <span className='goal'>$100,000</span> goal
                      <span className='percent-value'>70%</span>
                    </p>
                  </div>
                  <div className='cause-progress__bar'>
                    <div className='progress-bar-wrapper' data-percent='70%'>
                      <div className='progress-bar'>
                        <div
                          className='progress-bar-percent'
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                    </div>
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
          <div className='col-12 col-lg-6 col-xl-4'>
            <div className='cause__slider-single'>
              <div className='thumb'>
                <Link href='/cause-details'>
                  <img src='assets/images/cause/nine.png' alt='Image_inner' />
                </Link>
                <div className='tag'>
                  <Link href='/cause-details'>Food</Link>
                </div>
              </div>
              <div className='content'>
                <h6>
                  <Link href='/cause-details'>
                    It is a long established fact that a reader
                  </Link>
                </h6>
                <p>
                  Business is the activity of making one's buying and selling
                  product
                </p>
              </div>
              <div className='cause__slider-cta'>
                <div className='cause__progress progress-bar-single'>
                  <div className='cause-progress__intro'>
                    <p>
                      <span className='raised'>$25,294</span> raised of{" "}
                      <span className='goal'>$100,000</span> goal
                      <span className='percent-value'>80%</span>
                    </p>
                  </div>
                  <div className='cause-progress__bar'>
                    <div className='progress-bar-wrapper' data-percent='80%'>
                      <div className='progress-bar'>
                        <div
                          className='progress-bar-percent'
                          style={{ width: "80%" }}
                        ></div>
                      </div>
                    </div>
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
          <div className='col-12 col-lg-6 col-xl-4'>
            <div className='cause__slider-single'>
              <div className='thumb'>
                <Link href='/cause-details'>
                  <img src='assets/images/cause/ten.png' alt='Image_inner' />
                </Link>
                <div className='tag'>
                  <Link href='/cause-details'>Health</Link>
                </div>
              </div>
              <div className='content'>
                <h6>
                  <Link href='/cause-details'>
                    It is a long established fact that a reader
                  </Link>
                </h6>
                <p>
                  Business is the activity of making one's buying and selling
                  product
                </p>
              </div>
              <div className='cause__slider-cta'>
                <div className='cause__progress progress-bar-single'>
                  <div className='cause-progress__intro'>
                    <p>
                      <span className='raised'>$25,294</span> raised of{" "}
                      <span className='goal'>$100,000</span> goal
                      <span className='percent-value'>90%</span>
                    </p>
                  </div>
                  <div className='cause-progress__bar'>
                    <div className='progress-bar-wrapper' data-percent='90%'>
                      <div className='progress-bar'>
                        <div
                          className='progress-bar-percent'
                          style={{ width: "90%" }}
                        ></div>
                      </div>
                    </div>
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
      <div className='shape'>
        <img src='assets/images/shape-two.png' alt='Image_inner' />
      </div>
    </section>
  );
};

export default CauseTwo;
