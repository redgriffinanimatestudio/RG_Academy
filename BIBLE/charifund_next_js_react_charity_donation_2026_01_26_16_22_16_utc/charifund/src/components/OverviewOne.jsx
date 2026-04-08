import Link from "next/link";

const OverviewOne = () => {
  return (
    <section className='overview'>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div
              className='overview__inner'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={100}
            >
              <div className='overview__single overview__left'>
                <h4>Total Raised Fund</h4>
                <div className='cause__progress progress-bar-single'>
                  <div className='cause-progress__bar'>
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
                <div className='cause-progress__goal'>
                  <div className='goal-single'>
                    <span>Raised</span>
                    <h5>$40,802</h5>
                  </div>
                  <div className='goal-single'>
                    <span>Goal</span>
                    <h5>$100,000</h5>
                  </div>
                </div>
              </div>
              <div className='overview__single overview__right'>
                <span>Healtcare</span>
                <h4>
                  <Link href='/cause-details'>
                    Water For All Children, America
                  </Link>
                </h4>
                <p>
                  Charity is the act of extending love and kindness to others
                  which is a conscious act but the decision is made by the
                  heart,
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewOne;
