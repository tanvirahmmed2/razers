
import ContextProvider from "@/components/helper/Context";
import "./globals.css";
import ToastProvider from "@/components/helper/ToastProvider";


export const metadata = {
  title: {
    default: "Monihari",
    template: "%s | Monihari",
  },
  description: "Monihari app",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="w-full overflow-x-hidden relative bg-white">
        <ContextProvider>
          <ToastProvider>
            <main>{children}</main>
          </ToastProvider>
        </ContextProvider>
      </body>
    </html>
  );
}