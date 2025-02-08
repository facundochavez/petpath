import styles from './LevelButton.module.scss';
import { Skeleton, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import levelsDescriptions from '../../../../data/levels-descriptions.data';
import { message } from 'antd';
import { motion } from 'framer-motion';
import { useExploredBreedsContext } from 'context/exploredBreeds.context';
import { useTourContext } from 'context/tour.context';
import { useGlobalContext } from 'context/global.context';

const LevelButton = ({ featureIndex, level, levelInfo, cardIndex }) => {
  const { globalContext } = useGlobalContext();
  const { ref3 } = useTourContext();
  const { addNewBreed } = useExploredBreedsContext();
  const actions = [
    {
      action: '+',
      ability: levelInfo && levelInfo.plus_ability,
      z_index: 0,
      initial_position: 32
    },
    {
      action: '=',
      ability: levelInfo && levelInfo.equal_ability,
      z_index: 10,
      initial_position: 0
    },
    {
      action: '-',
      ability: levelInfo && levelInfo.less_ability,
      z_index: 0,
      initial_position: -32
    }
  ];

  const [messageApi, contextHolder] = message.useMessage();
  function warning() {
    messageApi.open({
      type: 'warning',
      content: 'Oops! No options that way...',
      style: {
        marginTop: 85
      }
    });
  }
  
  const [showActions, setShowActions] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setShowActions(false));

  return (
    <>
      {contextHolder}
      {!level ? (
        <div className={styles.skeleton_level_button}>
          <Skeleton.Button active />
        </div>
      ) : (
        <div
          className={styles.level_button}
          onClick={() => setShowActions(!showActions)}
          ref={featureIndex === 2 && globalContext === 'tour' ? ref3 : null}>
          <div className={styles.level_button__level_bar}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.points * 20}%` }}
              transition={{ duration: 0.8 }}
              style={{
                backgroundColor: showActions && 'var(--color-primary)'
              }}></motion.div>
          </div>

          <div
            className={styles.level_button__content}
            style={{ borderColor: showActions ? 'white' : null }}>
            <Tooltip
              title={levelsDescriptions[level].description}
              overlayInnerStyle={{ fontSize: '11px', color: 'black' }}
              overlayStyle={{ maxWidth: '230px', margin: '-20px 0 0 -20px' }}
              color='white'>
              <QuestionCircleOutlined />
            </Tooltip>
            <p>{levelsDescriptions[level].title}</p>
            <motion.div
              className={styles.level_button__content__image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}>
              <Image
                height={10}
                width={10}
                src={'/icons/fat-arrow-icon.svg'}
                alt='Arrow'
                style={{
                  filter: showActions
                    ? 'var(--filter-white)'
                    : levelInfo.points === 5
                    ? 'var(--filter-background)'
                    : null
                }}
              />
            </motion.div>
          </div>

          {showActions && (
            <div
              className={styles.level_button__options}
              ref={ref}
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}>
              {actions.map((option, optionIndex) => {
                return (
                  <motion.div
                    key={optionIndex}
                    className={styles.level_button__options__circle}
                    data-is-disabled={!option.ability}
                    style={{ zIndex: option.z_index }}
                    initial={{ y: option.initial_position }}
                    animate={{ y: 0 }}
                    onClick={
                      option.ability
                        ? () => {
                            addNewBreed({
                              selected_index: cardIndex,
                              selected_feature: featureIndex + 1,
                              selected_action: option.action
                            });
                          }
                        : warning
                    }>
                    {option.action}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LevelButton;
