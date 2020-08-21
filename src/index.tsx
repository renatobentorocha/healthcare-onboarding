import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { Pilates, Jogging, Mindfulness } from './components/Svg';

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

const Onboarding: React.FC = () => {
  const renderItem = ({ key, page }: Page) => {
    return (
      <View key={key} style={styles.item}>
        {page.hero}
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.excerpt}>{page.excerpt}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={pages}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={({ key }) => key}
        decelerationRate={'fast'}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      />
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
    borderWidth: 1,
  },
  title: {
    fontSize: 22,
    lineHeight: 26,
    textAlign: 'center',
    letterSpacing: -1,
    color: '#333333',
  },
  excerpt: {
    fontSize: 18,
    lineHeight: 21,
    textAlign: 'center',
    letterSpacing: -1,
    color: '#333333',
  },
});

export default Onboarding;
