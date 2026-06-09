import type { Metadata } from 'next';
import { Playfair_Display, Montserrat, Space_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Sidebar from './_components/nav/Sidebar';
import MobileNavbar from './_components/nav/MobileNavbar';
import PlayerBar from './_components/player/PlayerBar';
import OnboardingModal from './_components/ui/OnboardingModal';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Music4U — ML-Powered Editorial Music Recommendation Engine',
  description: 'Personalized music recommendations powered by advanced machine learning models, presented in a premium editorial interface.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} ${spaceMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-void-eclipse text-silver-mist flex flex-col font-interface select-none">
        <Providers>
          <div className="flex min-h-screen relative pb-48 md:pb-24">
            {/* Onboarding Screen */}
            <OnboardingModal />

            {/* Desktop Sidebar (hidden on mobile) */}
            <div className="hidden md:block flex-shrink-0">
              <Sidebar />
            </div>

            {/* Main Content Pane */}
            <main className="flex-1 w-full overflow-y-auto px-4 md:px-8 py-8 max-w-7xl mx-auto">
              {children}
            </main>

            {/* Mobile Bottom Tab Bar (hidden on desktop) */}
            <MobileNavbar />

            {/* Persistent bottom player bar */}
            <PlayerBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
