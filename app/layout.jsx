import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: 'Lake Merritt — The Living Necklace',
  description:
    "Oakland's iconic tidal lagoon: the United States' first official wildlife refuge, est. 1870.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
