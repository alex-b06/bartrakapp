import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface InstructionModalProps {
  body: string;
  onClose: () => void;
  title: string;
  visible: boolean;
}

export function InstructionModal({ body, onClose, title, visible }: InstructionModalProps) {
  const theme = useTheme();

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.backdrop}>
        <View style={[styles.panel, { backgroundColor: theme.background }]}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText themeColor="textSecondary">{body}</ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <ThemedText style={styles.buttonLabel}>Got It</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  panel: {
    borderRadius: 8,
    gap: Spacing.three,
    maxWidth: 420,
    padding: Spacing.four,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#22C55E',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  buttonLabel: {
    color: '#06130A',
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.78,
  },
});
