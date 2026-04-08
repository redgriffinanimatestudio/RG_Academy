import BannerFive from "@/components/BannerFive";
import BlogFour from "@/components/BlogFour";
import CauseThree from "@/components/CauseThree";
import CommitTwo from "@/components/CommitTwo";
import CommunityThree from "@/components/CommunityThree";
import FooterFive from "@/components/FooterFive";
import GalleryOne from "@/components/GalleryOne";
import GalleryTwo from "@/components/GalleryTwo";
import HeaderFive from "@/components/HeaderFive";
import OverviewTwo from "@/components/OverviewTwo";
import PartnerFive from "@/components/PartnerFive";
import Preloader from "@/components/Preloader";
import ServiceOne from "@/components/ServiceOne";
import ServiceTwo from "@/components/ServiceTwo";
import TeamFive from "@/components/TeamFive";
import TestimonialFive from "@/components/TestimonialFive";
import TopBarFive from "@/components/TopBarFive";
import VolunteerOne from "@/components/VolunteerOne";
import VolunteerTwo from "@/components/VolunteerTwo";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";

export const metadata = {
  title: "Charifund | Nonprofit & Fundraising Charity NEXT JS Template",
  description: "Nonprofit & Fundraising Charity NEXT JS Template.",
};

const page = () => {
  return (
    <AOSWrap>
      <section className='page-wrapper pg-four'>
        {/* Preloader */}
        <Preloader />

        {/* CustomCursor  */}
        <CustomCursor />

        {/* TopBarFive */}
        <TopBarFive />

        {/* HeaderFive */}
        <HeaderFive />

        {/* BannerFive */}
        <BannerFive />

        {/* OverviewTwo */}
        <OverviewTwo />

        {/* CommitTwo */}
        <CommitTwo />

        {/* ServiceOne */}
        <ServiceOne />

        {/* CauseThree */}
        <CauseThree />

        {/* GalleryTwo */}
        <GalleryTwo />

        {/* VolunteerOne */}
        <VolunteerOne />

        {/* ServiceTwo */}
        <ServiceTwo />

        {/* PartnerFive */}
        <PartnerFive />

        {/* CommunityThree */}
        <CommunityThree />

        {/* VolunteerTwo */}
        <VolunteerTwo />

        {/* TeamFive */}
        <TeamFive />

        {/* TestimonialFive */}
        <TestimonialFive />

        {/* BlogFour */}
        <BlogFour />

        {/* GalleryOne */}
        <GalleryOne />

        {/* FooterFive */}
        <FooterFive />
      </section>
    </AOSWrap>
  );
};

export default page;
