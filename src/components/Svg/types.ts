import Svg from 'react-native-svg';
import Animated from 'react-native-reanimated';

export const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export type SvgProps = Omit<React.SVGProps<SVGSVGElement>, 'opacity'> & {
  opacity: Animated.Node<number>;
};
