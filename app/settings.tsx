import { FormSwitch } from '@/components/forms/form-switch';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowUpRightIcon, DatabaseIcon, PaletteIcon, SettingsIcon } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }} showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          <Text className="mb-4 text-3xl font-bold">Settings</Text>
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
