import AwardOne from "@/components/AwardOne";
import BannerTwo from "@/components/BannerTwo";
import BlogTwo from "@/components/BlogTwo";
import CauseSliderOne from "@/components/CauseSliderOne";
import CtaSectionTwo from "@/components/CtaSectionTwo";
import FaqOne from "@/components/FaqOne";
import FooterTwo from "@/components/FooterTwo";
import GalleryOne from "@/components/GalleryOne";
import HeaderTwo from "@/components/HeaderTwo";
import HelpTwo from "@/components/HelpTwo";
import PartnerTwo from "@/components/PartnerTwo";
import Preloader from "@/components/Preloader";
import TeamTwo from "@/components/TeamTwo";
import TestimonialTwo from "@/components/TestimonialTwo";
import TopBarTwo from "@/components/TopBarTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";

export const metadata = {
  title: "Charifund | Nonprofit & Fundraising Charity NEXT JS Template",
  description: "Nonprofit & Fundraising Charity NEXT JS Template.",
};

const page = () => {
  return (
    <AOSWrap>
      <section className='page-wrapper'>
        {/* Preloader */}
        <Preloader />

        {/* CustomCursor  */}
        <CustomCursor />

        {/* TopBarTwo */}
        <TopBarTwo />

        {/* HeaderTwo */}
        <HeaderTwo />

        {/* BannerTwo */}
        <BannerTwo />

        {/* HelpTwo */}
        <HelpTwo />

        {/* CauseSliderOne */}
        <CauseSliderOne />

        {/* CtaSectionTwo */}
        <CtaSectionTwo />

        {/* AwardOne */}
        <AwardOne />

        {/* TeamTwo */}
        <TeamTwo />

        {/* FaqOne */}
        <FaqOne />

        {/* PartnerTwo */}
        <PartnerTwo />

        {/* TestimonialTwo */}
        <TestimonialTwo />

        {/* BlogTwo */}
        <BlogTwo />

        {/* GalleryOne */}
        <GalleryOne />

        {/* FooterTwo */}
        <FooterTwo />
      </section>
    </AOSWrap>
  );
};

export default page;
