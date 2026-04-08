const CheckoutInner = () => {
  return (
    <section className='checkout'>
      <div className='container'>
        <div className='row gutter-60'>
          <div className='col-12 col-lg-6'>
            <div
              className='checkout__form'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={100}
            >
              <div className='intro'>
                <h5>Delivery Information</h5>
              </div>
              <form action='#' method='post'>
                <div className='input-group'>
                  <div className='input-single'>
                    <input
                      type='text'
                      name='c-name'
                      id='cName'
                      placeholder='First Name'
                      required=''
                    />
                    <i className='fa-solid fa-user' />
                  </div>
                  <div className='input-single'>
                    <input
                      type='text'
                      name='c-lastname'
                      id='clastName'
                      placeholder='Last Name'
                      required=''
                    />
                    <i className='fa-solid fa-user' />
                  </div>
                </div>
                <div className='input-group'>
                  <div className='input-single'>
                    <input
                      type='text'
                      name='c-address'
                      id='cAddress'
                      placeholder='Your Address'
                      required=''
                    />
                    <i className='fa-solid fa-location-dot' />
                  </div>
                  <div className='input-single'>
                    <input
                      type='text'
                      name='c-country'
                      id='ccountry'
                      placeholder='Country'
                      required=''
                    />
                    <i className='fa-solid fa-location-dot' />
                  </div>
                </div>
                <div className='input-single'>
                  <input
                    type='text'
                    name='c-address-two'
                    id='cAddressTwo'
                    placeholder='House Number & street number'
                    required=''
                  />
                  <i className='fa-solid fa-location-dot' />
                </div>
                <div className='input-single'>
                  <input
                    type='text'
                    name='c-address-three'
                    id='cAddressThree'
                    placeholder='Apartment, suit, Unit etc'
                    required=''
                  />
                  <i className='fa-solid fa-location-dot' />
                </div>
                <div className='input-group'>
                  <div className='input-single'>
                    <input
                      type='number'
                      name='c-zip'
                      id='cZip'
                      placeholder='Zip Code'
                      required=''
                    />
                    <i className='fa-solid fa-location-dot' />
                  </div>
                  <div className='input-single'>
                    <input
                      type='text'
                      name='contact-number'
                      id='contactNumber'
                      placeholder='Phone Number'
                      required=''
                    />
                    <i className='fa-solid fa-user' />
                  </div>
                </div>
                <div className='input-single alter-input'>
                  <textarea
                    name='contact-message'
                    id='contactMessage'
                    placeholder='your message...'
                    defaultValue={""}
                  />
                  <i className='fa-solid fa-envelope' />
                </div>
                <div className='form-cta'>
                  <button
                    type='submit'
                    aria-label='submit message'
                    title='submit message'
                    className='btn--primary'
                  >
                    Save Informations <i className='fa-solid fa-arrow-right' />
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className='col-12 col-lg-6'>
            <div
              className='checkout__content'
              data-aos='fade-up'
              data-aos-duration={1000}
              data-aos-delay={100}
            >
              <div className='intro'>
                <h5>Order Summary</h5>
              </div>
              <form action='#' method='post'>
                <div className='content'>
                  <div className='content-single'>
                    <p>Subtotal</p>
                    <p>$345.00</p>
                  </div>
                  <div className='content-single'>
                    <p>Shipping Fee</p>
                    <p>$34.00</p>
                  </div>
                  <div className='content-single content-single-alt'>
                    <input
                      type='text'
                      required=''
                      name='promo-code'
                      id='promoCode'
                      placeholder='Enter Promo Code'
                    />
                    <button
                      type='submit'
                      aria-label='promo code'
                      title='promo code'
                      className='btn--primary'
                    >
                      Apply Code
                    </button>
                  </div>
                  <div className='content-inner'>
                    <div className='total'>
                      <h6>Total</h6>
                      <h6>$379.00</h6>
                    </div>
                    <div className='radio-wrapper inner'>
                      <div className='radio-single'>
                        <input
                          type='radio'
                          id='testDonation'
                          name='donation-payment'
                          defaultChecked=''
                        />
                        <label htmlFor='testDonation'>Bank Transfer</label>
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
                      <div className='radio-single'>
                        <input
                          type='radio'
                          id='offlineDonation'
                          name='donation-payment'
                          defaultChecked=''
                        />
                        <label htmlFor='offlineDonation'>
                          Cash On Delivery
                        </label>
                      </div>
                    </div>
                    <div className='form-cta'>
                      <button
                        type='submit'
                        aria-label='submit message'
                        title='submit message'
                        className='btn--primary'
                      >
                        Proceed To Pay <i className='fa-solid fa-arrow-right' />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutInner;
