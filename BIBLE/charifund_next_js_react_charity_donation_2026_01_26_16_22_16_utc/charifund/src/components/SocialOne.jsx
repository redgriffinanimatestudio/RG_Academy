import Link from "next/link";

const SocialOne = () => {
  return (
    <div className='social-sec'>
      <div className='social-sec-single'>
        <Link href='/'>
          <i className='fa-brands fa-facebook-f' />
          Facebook
        </Link>
        <Link href='/'>
          <i className='fa-brands fa-twitter' />
          Twitter
        </Link>
        <Link href='/'>
          <i className='fa-brands fa-instagram' />
          Instagram
        </Link>
        <Link href='/'>
          <i className='fa-brands fa-youtube' />
          Youtube
        </Link>
        <Link href='/'>
          <i className='fa-brands fa-pinterest' />
          Pinterest
        </Link>
        <Link href='/'>
          <i className='fa-brands fa-linkedin-in' />
          Linkedin
        </Link>
      </div>
    </div>
  );
};

export default SocialOne;
