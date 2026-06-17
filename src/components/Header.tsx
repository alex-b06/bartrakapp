import { Image } from 'expo-image';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface HeaderAction {
  accessibilityLabel: string;
  icon: SFSymbol;
  onPress: () => void;
}

interface HeaderProps {
  actions?: HeaderAction[];
}

export function Header({ actions = [] }: HeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} contentFit="contain" />
      <View style={styles.actions}>
        {actions.map(action => (
          <Pressable
            key={action.accessibilityLabel}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel}
            onPress={action.onPress}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.backgroundElement },
              pressed && styles.pressed,
            ]}>
            <SymbolView name={action.icon} tintColor={theme.text} size={20} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  logo: {
    height: 44,
    width: 128,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  pressed: {
    opacity: 0.72,
  },
});
