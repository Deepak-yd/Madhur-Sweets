import { Playfair_Display, Montserrat, Cinzel_Decorative, Great_Vibes } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-head',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const cinzel = Cinzel_Decorative({
  subsets: ['latin'],
  variable: '--font-accent',
  weight: ['700'],
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  variable: '--font-script',
  weight: ['400'],
  display: 'swap',
});

export const metadata = {
  title: 'Madhur Sweets — Pure Taste, Fresh Every Day',
  description:
    'Madhur Sweets, Dhanbad — Est. 2016. Handcrafted Indian sweets: chena, khowa, laddu, kaju, dry sweets, namkeens & Sawan specials. Order on Swiggy & Zomato.',
  keywords: 'Madhur Sweets, Dhanbad, Indian sweets, Rasgulla, Kaju Barfi, Motichoor Laddu, Namkeen',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} ${cinzel.variable} ${greatVibes.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
