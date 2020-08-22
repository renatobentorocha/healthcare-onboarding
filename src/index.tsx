import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

import Animated, {
  event,
  useCode,
  debug,
  interpolate,
  multiply,
  Extrapolate,
} from 'react-native-reanimated';
import { Pilates, Jogging, Mindfulness } from './components/Svg';
import { scale, sizeProps } from './utils';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const { width, height } = Dimensions.get('window');

const ORIGIN_HEIGHT = 812;
const ORIGIN_WIDTH = 375;

const SCALE_HEIGHT: sizeProps = {
  origin_size: ORIGIN_HEIGHT,
  destination_size: height,
  size: 0,
};

const SCALE_WIDTH: sizeProps = {
  origin_size: ORIGIN_WIDTH,
  destination_size: width,
  size: 0,
};

type Page = {
  key: string;
  page: {
    hero: JSX.Element;
    title: string;
    excerpt: string;
  };
};

const pages: Page[] = [
  {
    key: 'pilates',
    page: {
      hero: <Pilates />,
      title: 'Improve body balance',
      excerpt:
        'Exercise can improve your stability and also what is called your “kinesthetic awareness.',
    },
  },
  {
    key: 'jogging',
    page: {
      hero: <Jogging />,
      title: 'Stop wishing and get fit',
      excerpt:
        'Regardless of your body appearance, regular fitness helps improve your self-esteem.',
    },
  },
  {
    key: 'mindfulness',
    page: {
      hero: <Mindfulness />,
      title: 'Relieve stress with yoga',
      excerpt:
        'Yoga reduces stress and anxiety, which in turn reduces the physical effects of stress on the body.',
    },
  },
];

import { useFonts } from 'expo-font';

const Onboarding: React.FC = () => {
  const scrollX = useRef(new Animated.Value<number>(0)).current;

  const renderItem = ({ key, page }: Page) => {
    return (
      <View key={key} style={styles.item}>
        {page.hero}
      </View>
    );
  };

  useCode(() => debug('scrollX', scrollX), []);

  // const inputRange = [index * width, (index + 1) * width];

  // const outputRange = [1.3, 1];

  // const scale = interpolate(scrollX, {
  //   inputRange,
  //   outputRange,
  //   extrapolate: Extrapolate.CLAMP,
  // });

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        onScroll={event<NativeSyntheticEvent<NativeScrollEvent>>([
          { nativeEvent: { contentOffset: { x: scrollX } } },
        ])}
        horizontal
        data={pages}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={({ key }) => key}
        decelerationRate={'fast'}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      />
      <View style={styles.titleWrapper}>
        {pages.map(({ key, page }, index) => {
          const inputRange = [index * width, (index + 1) * width];
          const outputRange = [
            index * scale({ ...SCALE_HEIGHT, size: 36 }),
            (index + 1) * scale({ ...SCALE_HEIGHT, size: 36 }),
          ];

          const translateY = interpolate(scrollX, {
            inputRange,
            outputRange,
          });

          return (
            <Animated.Text
              key={key}
              style={[
                styles.title,
                { transform: [{ translateY: multiply(-1, translateY) }] },
              ]}
            >
              {page.title}
            </Animated.Text>
          );
        })}
      </View>

      <View style={styles.counter}>
        {pages.map(({ key, page }, index) => {
          return <Animated.View key={key} style={[styles.point]} />;
        })}
      </View>

      <TouchableOpacity style={styles.getStart}>
        <Text style={styles.getStartText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: 375,
  },
  titleWrapper: {
    position: 'absolute',
    top: scale({ ...SCALE_HEIGHT, size: 493 }),
    height: scale({ ...SCALE_HEIGHT, size: 36 }),
    overflow: 'hidden',
  },
  title: {
    fontSize: scale({ ...SCALE_HEIGHT, size: 32 }),
    lineHeight: scale({ ...SCALE_HEIGHT, size: 36 }),
    textAlign: 'center',
    letterSpacing: -1,
    color: '#333333',
    fontWeight: 'bold',
  },
  counter: {
    position: 'absolute',
    top: scale({ ...SCALE_HEIGHT, size: 701 }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: scale({ ...SCALE_WIDTH, size: 49 }),
  },
  point: {
    width: scale({ ...SCALE_WIDTH, size: 11 }),
    height: scale({ ...SCALE_WIDTH, size: 11 }),
    borderRadius: scale({ ...SCALE_WIDTH, size: 11 / 2 }),
    backgroundColor: '#DEF4FE',
  },
  getStart: {
    position: 'absolute',
    bottom: 0,
    width,
    height: scale({ ...SCALE_HEIGHT, size: 53 }),
    backgroundColor: '#FC6681',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartText: {
    fontSize: scale({ ...SCALE_HEIGHT, size: 22 }),
    lineHeight: scale({ ...SCALE_HEIGHT, size: 26 }),
    color: '#5AC8FA',
  },
});

export default Onboarding;
