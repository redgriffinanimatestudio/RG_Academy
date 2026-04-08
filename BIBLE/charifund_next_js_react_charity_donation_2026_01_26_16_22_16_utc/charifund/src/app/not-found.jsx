import ErrorInner from "@/components/ErrorInner";
import Preloader from "@/components/Preloader";
import AOSWrap from "@/helper/AOSWrap";
import CustomCursor from "@/helper/CustomCursor";

export default function NotFound() {
  return (
    <AOSWrap>
      <section className='page-wrapper'>
        {/* Preloader */}
        <Preloader />

        {/* CustomCursor  */}
        <CustomCursor />

        {/* ErrorInner */}
        <ErrorInner />
      </section>
    </AOSWrap>
  );
}
