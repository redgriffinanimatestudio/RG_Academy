"use client";
import Link from "next/link";
import { useState } from "react";

const CommunityOne = () => {
  let [amount, setAmount] = useState(50);
  return (
    <>
      <section className='community'>
        <div className='container'>
          <div className='row'>
            <div className='col-12 col-md-8 col-xl-7'>
              <div
                className='section__header'
                data-aos='fade-up'
                data-aos-duration={1000}
              >
                <span className='sub-title'>
                  <i className='icon-donation' />
                  Start donating poor people
                </span>
                <h2 className='title-animation_inner'>
                  Join The <span>Community</span> To Give Education For Children
                </h2>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <div
                className='community-donation'
                data-aos='fade-up'
                data-aos-duration={1000}
              >
                <div className='community-donation__inner'>
                  <h4>Support Where It Counts.</h4>
                  <div className='warning'>
                    <div className='line'>
                      <i className='fa-solid fa-triangle-exclamation' />
                    </div>
                    <p>
                      <strong>Notice:</strong> Test mode is enabled. While in
                      test mode no live donations are processed.
                    </p>
                  </div>
                  <div className='donation-form'>
                    <div className='donation-form__single'>
                      <h5>Your Donation:</h5>
                      <div className='input-group-icon'>
                        <div className='thumb'>
                          <i className='fa-solid fa-dollar-sign' />
                        </div>
                        <input
                          type='text'
                          name='donation-amount'
                          id='donationAmount'
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      <div className='made-amount'>
                        <span
                          className={`donation-amount ${
                            amount === 20 && "active"
                          }`}
                          onClick={() => setAmount(20)}
                        >
                          20
                        </span>
                        <span
                          className={`donation-amount ${
                            amount === 50 && "active"
                          }`}
                          onClick={() => setAmount(50)}
                        >
                          50
                        </span>
                        <span
                          className={`donation-amount ${
                            amount === 100 && "active"
                          }`}
                          onClick={() => setAmount(100)}
                        >
                          100
                        </span>
                        <span
                          className={`donation-amount ${
                            amount === 200 && "active"
                          }`}
                          onClick={() => setAmount(200)}
                        >
                          200
                        </span>
                        <span
                          className={`donation-amount custom-amount ${
                            amount === 0 && "active"
                          }`}
                          onClick={() => setAmount(0)}
                        >
                          Custom
                        </span>
                      </div>
                    </div>
                    <div className='donation-form__single'>
                      <h5>Select Payment Method</h5>
                      <div className='radio-wrapper'>
                        <div className='radio-single'>
                          <input
                            type='radio'
                            id='testDonation'
                            name='donation-payment'
                            defaultChecked=''
                          />
                          <label htmlFor='testDonation'>Test Donation</label>
                        </div>
                        <div className='radio-single'>
                          <input
                            type='radio'
                            id='offlineDonation'
                            name='donation-payment'
                            defaultChecked=''
                          />
                          <label htmlFor='offlineDonation'>
                            Offline Donation
                          </label>
                        </div>
                        <div className='radio-single'>
                          <input
                            type='radio'
                            id='cardDonation'
                            name='donation-payment'
                            defaultChecked=''
                          />
                          <label htmlFor='cardDonation'>Credit Card</label>
                        </div>
                      </div>
                    </div>
                    <div className='cta'>
                      <Link
                        href='/donate-us'
                        aria-label='donate us'
                        title='donate us'
                        className='btn--primary'
                      >
                        Donate Now <i className='fa-solid fa-arrow-right' />
                      </Link>
                    </div>
                  </div>
                </div>
                <div
                  className='community__thumb d-none d-lg-block'
                  data-aos='fade-left'
                  data-aos-duration={1000}
                >
                  <img
                    src='/assets/images/community/thumb.png'
                    alt='Image_inner'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='community-bg'>
          <img
            src='/assets/images/community/community-bg.png'
            alt='Image_inner'
          />
        </div>
        <div
          className='gift'
          data-aos='fade-up'
          data-aos-duration={1000}
          data-aos-delay={200}
        >
          <img src='/assets/images/community/gift.png' alt='Image_inner' />
        </div>
        <div className='spade'>
          <img
            src='/assets/images/community/spade.png'
            alt='Image_inner'
            className='base-img'
          />
        </div>
      </section>
    </>
  );
};

export default CommunityOne;
