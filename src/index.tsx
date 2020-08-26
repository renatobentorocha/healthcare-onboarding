import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  processColor,
} from 'react-native';

import Animated, {
  event,
  useCode,
  interpolate,
  multiply,
  Extrapolate,
  onChange,
  set,
  floor,
  divide,
  cond,
  eq,
  sub,
  add,
} from 'react-native-reanimated';

import { Pilates, Jogging, Mindfulness } from './components/Svg';
import { scale, sizeProps } from './utils';
import { SvgProps } from './components/Svg/types';

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
  Hero: (props: SvgProps) => JSX.Element;
  title: string;
  excerpt: string;
};

const pages: Page[] = [
  {
    key: 'pilates',
    Hero: Pilates,
    title: 'Improve body balance',
    excerpt:
      'Exercise can improve your stability and also what is called your “kinesthetic awareness.',
  },
  {
    key: 'jogging',
    Hero: Jogging,
    title: 'Stop wishing and get fit',
    excerpt:
      'Regardless of your body appearance, regular fitness helps improve your self-esteem.',
  },
  {
    key: 'mindfulness',
    Hero: Mindfulness,
    title: 'Relieve stress with yoga',
    excerpt:
      'Yoga reduces stress and anxiety, which in turn reduces the physical effects of stress on the body.',
  },
];

type RenderItemProps = {
  page: Page;
  opacity: Animated.Node<number>;
};

const renderItem = ({ page: { Hero, key }, opacity }: RenderItemProps) => (
  <View key={key} style={styles.item}>
    <Hero opacity={opacity} />
  </View>
);

const Onboarding: React.FC = () => {
  const scrollX = useRef(new Animated.Value<number>(0)).current;
  const scrollEndDragX = useRef(new Animated.Value<number>(0)).current;
  const scrollIndex = useRef(new Animated.Value<number>(0)).current;

  useCode(
    () =>
      onChange(
        scrollEndDragX,
        set(scrollIndex, floor(divide(scrollEndDragX, ORIGIN_WIDTH)))
      ),
    []
  );

  const indicatorScale = interpolate(scrollIndex, {
    inputRange: pages.map((_, index) => index),
    outputRange: pages.map(() => 1.3),
  });

  const indicatorColor = interpolate(scrollIndex, {
    inputRange: pages.map((_, index) => index),
    outputRange: pages.map(() => processColor('#5AC8FA')),
  });

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        onScroll={event<NativeSyntheticEvent<NativeScrollEvent>>([
          { nativeEvent: { contentOffset: { x: scrollX } } },
        ])}
        horizontal
        data={pages}
        renderItem={({ item, index }) => {
          const pageOpacity = interpolate(scrollX, {
            inputRange: [
              multiply(sub(index, 1), ORIGIN_WIDTH),
              multiply(index, ORIGIN_WIDTH),
              multiply(add(index, 1), ORIGIN_WIDTH),
            ],
            outputRange: [0, 1, 0],
            extrapolate: Extrapolate.CLAMP,
          });
          return renderItem({ page: item, opacity: pageOpacity });
        }}
        keyExtractor={({ key }) => key}
        decelerationRate={'fast'}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event<NativeSyntheticEvent<NativeScrollEvent>>([
          { nativeEvent: { contentOffset: { x: scrollEndDragX } } },
        ])}
        pagingEnabled
      />
      <View style={styles.titleWrapper}>
        {pages.map(({ key, title }, index) => {
          const translateY = interpolate(scrollX, {
            inputRange: [
              multiply(index, ORIGIN_WIDTH),
              multiply(add(index, 1), ORIGIN_WIDTH),
            ],
            outputRange: [
              multiply(index, scale({ ...SCALE_HEIGHT, size: 36 })),
              multiply(add(index, 1), scale({ ...SCALE_HEIGHT, size: 36 })),
            ],
          });

          const opacity = interpolate(scrollX, {
            inputRange: [
              multiply(sub(index, 1), ORIGIN_WIDTH),
              multiply(index, ORIGIN_WIDTH),
              multiply(add(index, 1), ORIGIN_WIDTH),
            ],
            outputRange: [0, 1, 0],
          });

          return (
            <Animated.Text
              key={key}
              style={[
                styles.title,
                { opacity },
                { transform: [{ translateY: multiply(-1, translateY) }] },
              ]}
            >
              {title}
            </Animated.Text>
          );
        })}
      </View>

      <View style={styles.counter}>
        {pages.map(({ key }, index) => {
          return (
            <Animated.View
              key={key}
              style={[
                styles.point,
                {
                  backgroundColor: cond(
                    eq(scrollIndex, index),
                    indicatorColor,
                    processColor('#DEF4FE')
                  ),
                },
                {
                  transform: [
                    {
                      scale: cond(eq(scrollIndex, index), indicatorScale, 1),
                    },
                  ],
                },
              ]}
            />
          );
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
    top: scale({ ...SCALE_HEIGHT, size: 510 }),
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
    fontWeight: '600',
  },
});

export default Onboarding;
