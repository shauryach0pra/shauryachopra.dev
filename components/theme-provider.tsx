'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

/**
 * A wrapper around the `next-themes` ThemeProvider to provide theme-switching functionality.
 * @param {ThemeProviderProps} props - The props for the component.
 * @returns {JSX.Element} The ThemeProvider component.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
