import styles from './BreedCard.module.scss';
import BreedImages from './BreedImages/BreedImages';
import { motion } from 'framer-motion';
import LevelButtons from './LevelButtons/LevelButtons';
import ExtraLevelButtons from './ExtraLevelButtons/ExtraLevelButtons';
import BreedDescription from './BreedDescription/BreedDescription';

const BreedCard = ({ isFirst, isLast, isActive, isPrev, breed, cardIndex }) => {

  ////COMPONENT
  return (
    <motion.div
      className={styles.breed_card}
      initial={{
        opacity: 0,
        scale: 0.75,
        originX: !isFirst ? 0 : 'unset',
        originY: !isFirst ? 0 : 'unset',
      }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: isFirst ? 0 : 0.65, duration: 0.1 }}
    >
      {/* LEFT CONTAINER */}
      <div className={styles.breed_card__side_container} />

      {/* MIDDLE CONTAINER */}
      <div
        className={styles.breed_card__middle_container}
        style={
          !isActive
            ? {
                marginTop: '20px',
                opacity: 0.5,
                pointerEvents: 'none',
              }
            : null
        }
      >
        <BreedImages images={breed?.images} />
        <LevelButtons
          levels={breed?.levels}
          selectedFeature={breed?.selected_feature}
          isActive={isActive}
          cardIndex={cardIndex}
        />
        <ExtraLevelButtons extraLevels={breed?.extra_levels} />
        <BreedDescription description={breed?.description} isActive={isActive} />
      </div>

      {/* RIGTH CONTAINER */}
      <div
        className={styles.breed_card__side_container}
        style={{ opacity: isLast ? 0 : 1 }}
      >
        {breed?.selected_feature && (
          <div className={styles.breed_card__side_container__subcontainer}>
            <motion.div
              className={
                styles.breed_card__side_container__subcontainer__up_line
              }
              style={{ opacity: isPrev ? 1 : 0.5 }}
              animate={{
                height: [0, 70, 70],
                width: [0, 0, 25],
                display: ['none', 'unset', 'unset'],
              }}
              transition={{ duration: 0.3, delay: 0.5 }}
            />
            <motion.div
              className={
                styles.breed_card__side_container__subcontainer__option
              }
              style={{ opacity: isPrev ? 1 : 0.5 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {breed?.selected_action}
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BreedCard;
