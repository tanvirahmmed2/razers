import ContextProvider from "@/components/helper/Context";
import "./globals.css";
import ToastProvider from "@/components/helper/ToastProvider";
import { headers } from "next/headers";
import { getTenant } from "@/lib/database/tenant";


export const metadata = {
  title: {
    default: "Nizam Varieties Store",
    template: "%s | Nizam Varieties Store",
  },
  description: "Nizam Varieties Store app",
};


export default async function RootLayout({ children }) {
  const headersList = await headers();
  const siteData = await getTenant({ headers: headersList });

  return (
    <html lang="en">
      <body className="w-full overflow-x-hidden relative bg-white">
        <ContextProvider initialSiteData={siteData}>
          <ToastProvider>
            <main>{children}</main>
          </ToastProvider>
        </ContextProvider>
      </body>
    </html>
  );
}