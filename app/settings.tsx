import { FormSwitch } from '@/components/forms/form-switch';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAppUpdates } from '@/hooks/use-app-updates';
import { ArrowUpRightIcon, DatabaseIcon, PaletteIcon, SettingsIcon, RefreshCwIcon, CheckCircle2Icon } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { isChecking, isUpdateAvailable, checkForUpdates } = useAppUpdates();
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const updateId = Updates.updateId || 'Development';
  
  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }} showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <Text className="mb-4 text-3xl font-bold">Settings</Text>
          
          {/* App Version & Update Section */}
          <View className="mb-6 bg-card rounded-3xl p-4 border border-border/50">
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-base font-semibold">App Version</Text>
                <Text className="text-xs text-muted-foreground mt-1">v{appVersion}</Text>
                {!__DEV__ && (
                  <Text className="text-xs text-muted-foreground">Build: {updateId.substring(0, 8)}</Text>
                )}
              </View>
              {isUpdateAvailable && (
                <View className="bg-green-500/10 px-3 py-1 rounded-full">
                  <Text className="text-xs font-medium text-green-600">Update Available</Text>
                </View>
              )}
            </View>
            <Button 
              onPress={() => checkForUpdates(false)}
              disabled={isChecking}
              className="flex-row items-center gap-2"
            >
              {isChecking ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Icon as={isUpdateAvailable ? CheckCircle2Icon : RefreshCwIcon} size={18} />
              )}
              <Text>{isChecking ? 'Checking...' : 'Check for Updates'}</Text>
            </Button>
          </View>

          <Accordion type="single" collapsible className="rounded-3xl bg-card">
            <AccordionItem value="account">
              <AccordionTrigger>
                <SectionHeader icon={SettingsIcon} title="Account" description="Connected services" />
              </AccordionTrigger>
              <AccordionContent>
                <FormSwitch label="MyAnimeList" description="Sync status: connected" value onValueChange={() => {}} />
                <FormSwitch label="AniList" description="Sync status: connect" value={false} onValueChange={() => {}} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="appearance">
              <AccordionTrigger>
                <SectionHeader icon={PaletteIcon} title="Appearance" description="Theme & icon" />
              </AccordionTrigger>
              <AccordionContent>
                <Button variant="outline" className="mb-3">
                  <Text>Theme: System</Text>
                </Button>
                <Button variant="outline">
                  <Text>App Icon</Text>
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="data">
              <AccordionTrigger>
                <SectionHeader icon={DatabaseIcon} title="Data" description="Backup & cache" />
              </AccordionTrigger>
              <AccordionContent>
                <Button className="mb-3">
                  <Text>Backup</Text>
                </Button>
                <Button variant="outline">
                  <Text>Clear Cache</Text>
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Button variant="ghost" className="mt-6 flex-row items-center justify-center gap-2">
            <Text>View Changelog</Text>
            <Icon as={ArrowUpRightIcon} />
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

type SectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

function SectionHeader({ icon: IconComponent, title, description }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="rounded-2xl bg-primary/10 p-3">
        <Icon as={IconComponent} className="text-primary" size={18} />
      </View>
      <View>
        <Text className="text-base font-semibold">{title}</Text>
        <Text className="text-xs text-muted-foreground">{description}</Text>
      </View>
    </View>
  );
}
