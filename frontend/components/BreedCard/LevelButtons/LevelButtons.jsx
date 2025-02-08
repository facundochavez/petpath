import styles from './LevelButtons.module.scss';
import LevelButton from './LevelButton/LevelButton';
import { motion } from 'framer-motion';
import { useTourContext } from 'context/tour.context';
import { useGlobalContext } from 'context/global.context';

const LEVELS = ['affection_level','adaptability','energy_level','intelligence','vocalisation','social_needs']

const LevelButtons = ({ levels, selectedFeature, isActive, cardIndex }) => {
  const { globalContext } = useGlobalContext();
  const { ref2 } = useTourContext();
  ////COMPONENT
  return (
    <div
      className={styles.level_buttons}
      style={!isActive ? { filter: 'grayscale() brightness(0.9)' } : null}
      ref={globalContext === 'tour' ? ref2 : null}>
      {selectedFeature && (
        <motion.div
          className={styles.level_buttons__down_line}
          initial={{ height: 0 }}
          animate={{
            height: `${200 + 42 * (selectedFeature - 1)}px`
          }}
          transition={{ duration: 0.5 }}
          style={{
            bottom: `${228 - 42 * (selectedFeature - 1)}px`
          }}
        />
      )}
      {LEVELS.map((level, index) => {
        return (
          <LevelButton
            key={index}
            featureIndex={index}
            level={levels[level] ? level : null}
            levelInfo={levels[level]}
            cardIndex={cardIndex}
          />
        );
      })}
    </div>
  );
};

export default LevelButtons;
