import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CreateCarpoolPostInput, CreateMarketplaceItemInput } from '../services/api';
import { CarpoolType } from '../types/domain';

type PostMode = 'carpool' | 'market';

type Props = {
  defaultMode: PostMode;
  isSubmitting: boolean;
  isVisible: boolean;
  onClose: () => void;
  onSubmitCarpool: (input: CreateCarpoolPostInput) => void;
  onSubmitMarketplace: (input: CreateMarketplaceItemInput) => void;
};

const defaultCarpoolTime = 'Today 6:00 PM';

export function PostSheet({
  defaultMode,
  isSubmitting,
  isVisible,
  onClose,
  onSubmitCarpool,
  onSubmitMarketplace,
}: Props) {
  const [mode, setMode] = useState<PostMode>(defaultMode);
  const [carpoolType, setCarpoolType] = useState<CarpoolType>('offer');
  const [fromArea, setFromArea] = useState('');
  const [toArea, setToArea] = useState('');
  const [departureTime, setDepartureTime] = useState(defaultCarpoolTime);
  const [seats, setSeats] = useState('1');
  const [carpoolPrice, setCarpoolPrice] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('good');
  const [area, setArea] = useState('');

  useEffect(() => {
    if (isVisible) {
      setMode(defaultMode);
    }
  }, [defaultMode, isVisible]);

  function submitCarpool() {
    const normalizedSeats = Number.parseInt(seats, 10);

    onSubmitCarpool({
      departureTime,
      fromArea: fromArea.trim(),
      price: carpoolPrice.trim() || 'free',
      seats: Number.isNaN(normalizedSeats) ? 1 : Math.max(1, normalizedSeats),
      toArea: toArea.trim(),
      type: carpoolType,
    });
  }

  function submitMarketplace() {
    onSubmitMarketplace({
      area: area.trim(),
      category: category.trim() || 'general',
      condition: condition.trim() || 'good',
      description: description.trim() || title.trim(),
      imageUrls: [],
      price: price.trim() || 'free',
      title: title.trim(),
    });
  }

  const canSubmitCarpool = fromArea.trim().length > 0 && toArea.trim().length > 0;
  const canSubmitMarketplace = title.trim().length > 0 && area.trim().length > 0;
  const canSubmit = mode === 'carpool' ? canSubmitCarpool : canSubmitMarketplace;

  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Create post</Text>
              <Text style={styles.subtitle}>Share only approximate areas until both sides agree.</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={22} color="#25343F" />
            </Pressable>
          </View>

          <View style={styles.segment}>
            <ModeButton active={mode === 'carpool'} icon="car-sport" label="Ride" onPress={() => setMode('carpool')} />
            <ModeButton active={mode === 'market'} icon="bag-handle" label="Item" onPress={() => setMode('market')} />
          </View>

          {mode === 'carpool' ? (
            <View style={styles.form}>
              <View style={styles.segment}>
                <ModeButton active={carpoolType === 'offer'} icon="navigate" label="Offer" onPress={() => setCarpoolType('offer')} />
                <ModeButton active={carpoolType === 'request'} icon="hand-left" label="Request" onPress={() => setCarpoolType('request')} />
              </View>
              <Field value={fromArea} placeholder="From area" onChangeText={setFromArea} />
              <Field value={toArea} placeholder="To area" onChangeText={setToArea} />
              <Field value={departureTime} placeholder="Departure time" onChangeText={setDepartureTime} />
              <View style={styles.row}>
                <Field keyboardType="number-pad" value={seats} placeholder="Seats" onChangeText={setSeats} />
                <Field value={carpoolPrice} placeholder="Price" onChangeText={setCarpoolPrice} />
              </View>
            </View>
          ) : (
            <View style={styles.form}>
              <Field value={title} placeholder="Item title" onChangeText={setTitle} />
              <Field multiline value={description} placeholder="Description" onChangeText={setDescription} />
              <View style={styles.row}>
                <Field value={price} placeholder="Price" onChangeText={setPrice} />
                <Field value={condition} placeholder="Condition" onChangeText={setCondition} />
              </View>
              <View style={styles.row}>
                <Field value={category} placeholder="Category" onChangeText={setCategory} />
                <Field value={area} placeholder="Area" onChangeText={setArea} />
              </View>
            </View>
          )}

          <Pressable
            disabled={!canSubmit || isSubmitting}
            style={[styles.submit, !canSubmit || isSubmitting ? styles.disabled : null]}
            onPress={mode === 'carpool' ? submitCarpool : submitMarketplace}
          >
            <Ionicons name={isSubmitting ? 'hourglass' : 'add-circle'} size={19} color="#FFFFFF" />
            <Text style={styles.submitText}>{isSubmitting ? 'Posting...' : 'Post now'}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Field({
  keyboardType,
  multiline,
  onChangeText,
  placeholder,
  value,
}: {
  keyboardType?: 'default' | 'number-pad';
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <TextInput
      keyboardType={keyboardType}
      multiline={multiline}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#7B8580"
      style={[styles.input, multiline ? styles.multiline : null]}
      value={value}
    />
  );
}

function ModeButton({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.modeButton, active ? styles.modeButtonActive : null]} onPress={onPress}>
      <Ionicons name={icon} size={16} color={active ? '#FFFFFF' : '#25343F'} />
      <Text style={[styles.modeText, active ? styles.modeTextActive : null]}>{label}</Text>
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
  form: {
    gap: 10,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#F6F8F7',
    borderColor: '#E0E6E2',
    borderRadius: 8,
    borderWidth: 1,
    color: '#16211D',
    flex: 1,
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modeButton: {
    alignItems: 'center',
    backgroundColor: '#EDF1F3',
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    minHeight: 40,
  },
  modeButtonActive: {
    backgroundColor: '#176B4D',
  },
  modeText: {
    color: '#25343F',
    fontSize: 13,
    fontWeight: '800',
  },
  modeTextActive: {
    color: '#FFFFFF',
  },
  multiline: {
    minHeight: 78,
    textAlignVertical: 'top',
  },
  overlay: {
    backgroundColor: 'rgba(22, 33, 29, 0.38)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  segment: {
    flexDirection: 'row',
    gap: 8,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    gap: 16,
    padding: 18,
    paddingBottom: 28,
  },
  submit: {
    alignItems: 'center',
    backgroundColor: '#176B4D',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
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
