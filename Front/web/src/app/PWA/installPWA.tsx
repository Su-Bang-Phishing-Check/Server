'use client';

import { useEffect, useMemo, useState } from 'react';

export type InstallState =
  | 'idle'
  | 'can-install'
  | 'installed'
  | 'unsupported'
  | 'blocked';

const isStandaloneDisplay = () => {
  if (typeof window === 'undefined') return false;
  const standaloneMq = window.matchMedia?.(
    '(display-mode: standalone)'
  ).matches;
  const navigatorStandalone =
    (window.navigator as any).standalone === true;
  return Boolean(standaloneMq || navigatorStandalone);
};

const isIOS = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;

  if (/iPad|iPhone|iPod/.test(ua)) {
    return true;
  }
  if (/Macintosh/.test(ua) && 'ontouchend' in document) {
    return true;
  }
  return false;
};

const InstallPWA = () => {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState<boolean>(
    isStandaloneDisplay()
  );

  const ios = useMemo(() => isIOS(), []);

  useEffect(() => {
    if (ios) return;

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const bip = e as BeforeInstallPromptEvent;
      window.deferredPWAInstallPrompt = bip;
      setInstallEvent(bip);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
      window.deferredPWAInstallPrompt = null;
    };
    window.addEventListener(
      'beforeinstallprompt',
      onBeforeInstallPrompt as any
    );
    window.addEventListener('appinstalled', onAppInstalled);

    setInstalled(isStandaloneDisplay());

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        onBeforeInstallPrompt as any
      );
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [ios]);

  const state: InstallState = useMemo(() => {
    if (ios) return 'unsupported';
    if (installed) return 'installed';
    if (installEvent) return 'can-install';
    return 'unsupported';
  }, [ios, installed, installEvent]);

  const promptInstall = async (): Promise<
    'accepted' | 'dismissed' | 'unavailable'
  > => {
    if (!installEvent || ios || installed) return 'unavailable';
    installEvent.prompt();
    const choice = await installEvent.userChoice;
    window.deferredPWAInstallPrompt = null;
    setInstallEvent(null);
    return choice.outcome;
  };

  return { state, ios, installed, promptInstall };
};

export default InstallPWA;
