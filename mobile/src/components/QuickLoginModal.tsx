import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type LoginProvider = 'phone' | 'google' | 'facebook';

type Props = {
  action: string;
  isVisible: boolean;
  isWorking: boolean;
  onClose: () => void;
  onLogin: (provider: LoginProvider) => void;
};

export function QuickLoginModal({ action, isVisible, isWorking, onClose, onLogin }: Props) {
  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Quick login</Text>
              <Text style={styles.subtitle}>{action} needs identity and trust history.</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={22} color="#25343F" />
            </Pressable>
          </View>

          <View style={styles.options}>
            <LoginOption icon="call" label="Phone" disabled={isWorking} onPress={() => onLogin('phone')} />
            <LoginOption icon="logo-google" label="Google" disabled={isWorking} onPress={() => onLogin('google')} />
            <LoginOption icon="logo-facebook" label="Facebook" disabled={isWorking} onPress={() => onLogin('facebook')} />
          </View>

          <Text style={styles.note}>Browsing stays open without login. We ask only before posting, confirming, or contacting.</Text>
        </View>
      </View>
    </Modal>
  );
}

function LoginOption({
  disabled,
  icon,
  label,
  onPress,
}: {
  disabled: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable disabled={disabled} style={[styles.option, disabled ? styles.disabled : null]} onPress={onPress}>
      <Ionicons name={icon} size={20} color="#176B4D" />
      <Text style={styles.optionText}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#8A928D" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#EDF1F3',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  disabled: {
    opacity: 0.55,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  note: {
    color: '#68726C',
    fontSize: 12,
    lineHeight: 17,
  },
  option: {
    alignItems: 'center',
    backgroundColor: '#F6F8F7',
    borderColor: '#E0E6E2',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  optionText: {
    color: '#16211D',
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  options: {
    gap: 9,
  },
  overlay: {
    backgroundColor: 'rgba(22, 33, 29, 0.38)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    gap: 16,
    padding: 18,
    paddingBottom: 28,
  },
  subtitle: {
    color: '#68726C',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
  title: {
    color: '#16211D',
    fontSize: 21,
    fontWeight: '900',
  },
});
