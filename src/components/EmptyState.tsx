import { SymbolView, type SFSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface EmptyStateProps {
  actionLabel?: string;
  icon?: SFSymbol;
  message: string;
  onActionPress?: () => void;
  title: string;
}

export function EmptyState({
  actionLabel,
  icon = 'figure.strengthtraining.traditional',
  message,
  onActionPress,
  title,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
        <SymbolView name={icon} tintColor={theme.text} size={34} />
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.message}>
        {message}
      </ThemedText>
      {actionLabel && onActionPress ? (
        <Pressable
          accessibilityRole="button"
          onPress={onActionPress}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
          <ThemedText style={styles.actionLabel}>{actionLabel}</ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 8,
    gap: Spacing.two,
    padding: Spacing.four,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    textAlign: 'center',
  },
  message: {
    maxWidth: 280,
    textAlign: 'center',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#22C55E',
    borderRadius: 8,
    marginTop: Spacing.two,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  actionLabel: {
    color: '#06130A',
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.78,
  },
});
