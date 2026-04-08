import Link from "next/link";

const GoalOne = () => {
  return (
    <section className='fc-goal pt-120'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-6 col-xl-5'>
            <div className='goal__content text-center mb-60'>
              <h5 className='title-animation_inner fw-7'>
                Whatever it is that you care about, there will be a charity
                working on it.
              </h5>
            </div>
          </div>
        </div>
        <div className='row gutter-30'>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='goal__single'>
              <div className='thumb'>
                <h2 className='fw-8'>42</h2>
              </div>
              <div className='content'>
                <h6 className='fw-8'>People</h6>
                <p>Prevention of Cruelty</p>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='goal__single goal__single-active'>
              <div className='thumb'>
                <h2 className='fw-8'>73</h2>
              </div>
              <div className='content'>
                <h6 className='fw-8'>Society</h6>
                <p>Prevention of Cruelty</p>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6 col-xl-4'>
            <div className='goal__single'>
              <div className='thumb'>
                <h2 className='fw-8'>09</h2>
              </div>
              <div className='content'>
                <h6 className='fw-8'>People</h6>
                <p>Prevention of Cruelty</p>
              </div>
            </div>
          </div>
        </div>
        <div className='row justify-content-center'>
          <div className='col-12 col-xl-10'>
            <div className='goal__inner mt-120'>
              <div className='goal__left'>
                <h4 className='fw-7 hb'>Our Goal is to Help Poor People</h4>
                <Link href='/become-volunteer'>
                  Become volunteer
                  <i className='fa-solid fa-arrow-right' />
                </Link>
              </div>
              <div className='goal__right'>
                <Link
                  href='/become-volunteer'
                  aria-label='Donate Now'
                  title='Donate Now'
                  className='btn--primary'
                >
                  Donate Now <i className='icon-heart' />
                </Link>
              </div>
              <img src='assets/images/fc-three.png' alt='Image_inner' />
            </div>
          </div>
        </div>
      </div>
      <div className='fc-one'>
        <img src='assets/images/fc-four.png' alt='Image_inner' />
      </div>
    </section>
  );
};

export default GoalOne;
