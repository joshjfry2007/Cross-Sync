import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";

export const metadata = {
  title: "Cross-Sync",
  description: "Cross-tab synced preferences dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={"h-full antialiased"}
    >
      <body className="min-h-full flex flex-col">
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
