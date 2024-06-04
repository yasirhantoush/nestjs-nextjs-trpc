import { JetBrains_Mono as FontMono, Inter as FontSans } from "next/font/google"
import localFont from "next/font/local";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fontJenna = localFont({
  src: [
    {
      path: '../../public/fonts/Janna LT Regular.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Janna LT Medium.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Janna LT Bold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-jenna',
});

export const fontExpo = localFont({
  src: [
    {
      path: '../../public/fonts/expo_arabic.ttf',
      style: 'normal',
    },
  ],
  variable: '--font-jenna',
});