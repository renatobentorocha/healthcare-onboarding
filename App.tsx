import { StatusBar } from 'expo-status-bar';
import React from 'react';

import Onboarding from './src';
export default function App() {
  return (
    <>
      <Onboarding />
      <StatusBar style="auto" />
    </>
  );
}
