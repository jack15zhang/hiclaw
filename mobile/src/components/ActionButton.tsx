import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

export function ActionButton({ icon, label, onPress }: Props) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name={icon} size={19} color="#1F352E" />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#EEF7F2',
    borderColor: '#CDE4D8',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 42,
    paddingHorizontal: 12,
  },
  label: {
    color: '#1F352E',
    fontSize: 14,
    fontWeight: '700',
  },
});
