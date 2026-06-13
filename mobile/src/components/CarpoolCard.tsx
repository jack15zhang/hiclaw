import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CarpoolPost } from '../types/domain';

type Props = {
  post: CarpoolPost;
  onConfirm: () => void;
};

export function CarpoolCard({ post, onConfirm }: Props) {
  const label = post.type === 'offer' ? 'Offering' : 'Requesting';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.type}>{label}</Text>
        <View style={styles.trust}>
          <Ionicons name="shield-checkmark" size={14} color="#176B4D" />
          <Text style={styles.trustText}>L{post.trustLevel}</Text>
        </View>
      </View>
      <Text style={styles.route}>{post.fromArea} to {post.toArea}</Text>
      <Text style={styles.meta}>{post.time} | {post.seats} seat(s) | {post.price}</Text>
      <Text style={styles.privacy}>{post.distanceBand}. Exact pickup is hidden until both sides confirm.</Text>
      <Pressable style={styles.primary} onPress={onConfirm}>
        <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
        <Text style={styles.primaryText}>Confirm</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E1E5E0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    color: '#5B625E',
    fontSize: 13,
  },
  primary: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#176B4D',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    minHeight: 38,
    paddingHorizontal: 12,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  privacy: {
    color: '#7A6151',
    fontSize: 12,
    lineHeight: 17,
  },
  route: {
    color: '#16211D',
    fontSize: 17,
    fontWeight: '800',
  },
  trust: {
    alignItems: 'center',
    backgroundColor: '#EAF6EF',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  trustText: {
    color: '#176B4D',
    fontSize: 12,
    fontWeight: '800',
  },
  type: {
    color: '#176B4D',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
