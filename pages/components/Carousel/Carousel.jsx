import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './Carousel.module.scss';
import { useTourContext } from 'pages/context/tour.context';
import { useExploredBreedsContext } from 'pages/context/exploredBreeds.context';
import { useSwiperContext } from 'pages/context/swiper.context';
import BreedCard from 'components/BreedCard/BreedCard';

const Carousel = () => {
  const { exploredBreeds } = useExploredBreedsContext();
  const { showTour } = useTourContext();
  const { setSwiper, activeSwiperIndex, setActiveSwiperIndex } =
    useSwiperContext();

  ////COMPONENT
  return (
    <section
      className={styles.carousel}
      style={{ pointerEvents: showTour ? 'none' : 'unset' }}
    >
      <Swiper
        touchStartPreventDefault={false}
        onSwiper={(s) => {
          setSwiper(s);
        }}
        onSlideChange={(s) => setActiveSwiperIndex(s.activeIndex)}
        style={{
          width: '100%',
          maxWidth: '400px',
          overflow: 'visible',
        }}
        slidesPerView={1}
        spaceBetween={0}
        navigation={false}
        speed={500}
        allowSlidePrev={exploredBreeds[activeSwiperIndex].name}
      >
        {exploredBreeds.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              {({ isActive, isPrev }) => (
                <BreedCard
                  isFirst={index + 1 === 1}
                  isLast={index + 1 === exploredBreeds.length}
                  isActive={isActive}
                  isPrev={isPrev}
                  breed={item}
                  cardIndex={index}
                />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default Carousel;
