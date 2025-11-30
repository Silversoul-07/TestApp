import * as Updates from 'expo-updates';
import React from 'react';
import { Alert } from 'react-native';

export function useAppUpdates() {
  const [isChecking, setIsChecking] = React.useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = React.useState(false);
  const [updateInfo, setUpdateInfo] = React.useState<Updates.UpdateCheckResult | null>(null);

  const checkForUpdates = React.useCallback(async (silent = false) => {
    if (__DEV__) {
      console.log('Updates are disabled in development mode');
      return;
    }

    try {
      setIsChecking(true);
      const update = await Updates.checkForUpdateAsync();
      
      setUpdateInfo(update);
      setIsUpdateAvailable(update.isAvailable);

      if (update.isAvailable) {
        if (!silent) {
          Alert.alert(
            'Update Available',
            'A new version of the app is available. Would you like to update now?',
            [
              {
                text: 'Later',
                style: 'cancel',
              },
              {
                text: 'Update',
                onPress: downloadAndApplyUpdate,
              },
            ]
          );
        }
      } else if (!silent) {
        Alert.alert('No Updates', 'You are using the latest version.');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      if (!silent) {
        Alert.alert('Error', 'Failed to check for updates. Please try again later.');
      }
    } finally {
      setIsChecking(false);
    }
  }, []);

  const downloadAndApplyUpdate = React.useCallback(async () => {
    try {
      setIsChecking(true);
      
      // Show progress alert
      Alert.alert(
        'Downloading Update',
        'Please wait while we download the latest version...',
        [],
        { cancelable: false }
      );

      await Updates.fetchUpdateAsync();
      
      // Update downloaded successfully
      Alert.alert(
        'Update Ready',
        'The update has been downloaded. The app will restart to apply the changes.',
        [
          {
            text: 'Restart Now',
            onPress: async () => {
              await Updates.reloadAsync();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error downloading update:', error);
      Alert.alert(
        'Update Failed',
        'Failed to download the update. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Auto-check for updates on mount
  React.useEffect(() => {
    if (!__DEV__) {
      checkForUpdates(true);
    }
  }, []);

  return {
    isChecking,
    isUpdateAvailable,
    updateInfo,
    checkForUpdates,
    downloadAndApplyUpdate,
  };
}
