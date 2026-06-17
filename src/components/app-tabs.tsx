import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import { useColorScheme, type ColorValue } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.backgroundElement,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon color={color} size={size} source={require('@/assets/images/tabIcons/icons8-home-25.png')} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Track',
          tabBarIcon: ({ color, size }) => (
            <TabIcon
              color={color}
              size={size}
              source={require('@/assets/images/tabIcons/icons8-camera-25.png')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <TabIcon
              color={color}
              size={size}
              source={require('@/assets/images/tabIcons/icons8-history-25.png')}
            />
          ),
        }}
      />
      <Tabs.Screen name="results" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}

function TabIcon({ color, size, source }: { color: ColorValue; size: number; source: number }) {
  return <Image source={source} style={{ height: size, tintColor: color, width: size }} />;
}
