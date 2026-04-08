const TopBarFour = () => {
  return (
    <div className='topbar topbar--secondary four topbar--quaternary d-none d-lg-block'>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div className='topbar__inner'>
              <div className='row align-items-center gutter-12'>
                <div className='col-12 col-xxl-7'>
                  <div className='topbar__list-wrapper'>
                    <ul className='topbar__list justify-content-center justify-content-xxl-start'>
                      <li>
                        <i className='fa-solid fa-comment-dots' /> Helpline:{" "}
                        <a href='tel:2305-587-3407'>+2(305) 587-3407</a>
                      </li>
                      <li>
                        <span className='divider' />
                      </li>
                      <li>
                        <a href='mailto:example@info.com'>example@info.com</a>
                      </li>
                      <li>
                        <span className='divider' />
                      </li>
                      <li>
                        <a
                          href='https://maps.app.goo.gl/Gr9pTNqz5FRNrjQw8'
                          target='_blank'
                          rel='noreferrer'
                        >
                          54 Berrick St Boston MA 02115
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='col-12 col-xxl-5'>
                  <div className='topbar__extra text-center justify-content-center justify-content-xxl-end'>
                    <p>
                      Updates: Delivers Personal Protective Equipments to North.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarFour;
