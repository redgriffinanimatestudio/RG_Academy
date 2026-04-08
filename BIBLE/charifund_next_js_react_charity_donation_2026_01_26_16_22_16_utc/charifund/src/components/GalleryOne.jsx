import Link from "next/link";

const GalleryOne = () => {
  return (
    <div className='gallery'>
      <div className='gallery__inner'>
        <div className='gallery__slider'>
          <div className='gallery__single'>
            <img src='assets/images/gallery/one.png' alt='Image_inner' />
            <Link href='/'>
              <i className='fa-brands fa-instagram' />
            </Link>
          </div>
          <div className='gallery__single'>
            <img src='assets/images/gallery/two.png' alt='Image_inner' />
            <Link href='/'>
              <i className='fa-brands fa-instagram' />
            </Link>
          </div>
          <div className='gallery__single'>
            <img src='assets/images/gallery/three.png' alt='Image_inner' />
            <Link href='/'>
              <i className='fa-brands fa-instagram' />
            </Link>
          </div>
          <div className='gallery__single'>
            <img src='assets/images/gallery/four.png' alt='Image_inner' />
            <Link href='/'>
              <i className='fa-brands fa-instagram' />
            </Link>
          </div>
          <div className='gallery__single'>
            <img src='assets/images/gallery/five.png' alt='Image_inner' />
            <Link href='/'>
              <i className='fa-brands fa-instagram' />
            </Link>
          </div>
          <div className='gallery__single'>
            <img src='assets/images/gallery/six.png' alt='Image_inner' />
            <Link href='/'>
              <i className='fa-brands fa-instagram' />
            </Link>
          </div>
          <div className='gallery__single'>
            <img src='assets/images/gallery/one.png' alt='Image_inner' />
            <Link href='/'>
              <i className='fa-brands fa-instagram' />
            </Link>
          </div>
          <div className='gallery__single'>
            <img src='assets/images/gallery/two.png' alt='Image_inner' />
            <Link href='/'>
              <i className='fa-brands fa-instagram' />
            </Link>
          </div>
          <div className='gallery__single'>
            <img src='assets/images/gallery/three.png' alt='Image_inner' />
            <Link href='/'>
              <i className='fa-brands fa-instagram' />
            </Link>
          </div>
          <div className='gallery__single'>
            <img src='assets/images/gallery/four.png' alt='Image_inner' />
            <Link href='/'>
              <i className='fa-brands fa-instagram' />
            </Link>
          </div>
          <div className='gallery__single'>
            <img src='assets/images/gallery/five.png' alt='Image_inner' />
            <Link href='/'>
              <i className='fa-brands fa-instagram' />
            </Link>
          </div>
          <div className='gallery__single'>
            <img src='assets/images/gallery/six.png' alt='Image_inner' />
            <Link href='/'>
              <i className='fa-brands fa-instagram' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryOne;
