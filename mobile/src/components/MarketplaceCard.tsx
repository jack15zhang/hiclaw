import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MarketplaceItem } from '../types/domain';

type Props = {
  item: MarketplaceItem;
  onContact: () => void;
};

export function MarketplaceCard({ item, onContact }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.meta}>{item.condition} | {item.area} | {item.distanceBand}</Text>
        <Pressable style={styles.secondary} onPress={onContact}>
          <Ionicons name="chatbubble-ellipses" size={17} color="#25343F" />
          <Text style={styles.secondaryText}>Contact</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    gap: 6,
    padding: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E1E5E0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: {
    backgroundColor: '#DCE4E0',
    width: 104,
  },
  meta: {
    color: '#69706C',
    fontSize: 12,
    lineHeight: 17,
  },
  price: {
    color: '#176B4D',
    fontSize: 16,
    fontWeight: '900',
  },
  secondary: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EDF1F3',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    minHeight: 34,
    paddingHorizontal: 10,
  },
  secondaryText: {
    color: '#25343F',
    fontSize: 13,
    fontWeight: '800',
  },
  title: {
    color: '#16211D',
    fontSize: 15,
    fontWeight: '800',
  },
});
