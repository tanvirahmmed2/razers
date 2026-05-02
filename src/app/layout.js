import ContextProvider from "@/components/helper/Context";
import "./globals.css";
import ToastProvider from "@/components/helper/ToastProvider";
import { headers } from "next/headers";
import { getTenant } from "@/lib/database/tenant";


export async function generateMetadata() {
  const headersList = await headers();
  const siteData = await getTenant({ headers: headersList });

  const title = siteData?.meta_title || siteData?.website_name || "Nizam Varieties Store";
  const description = siteData?.meta_description || "Premium Shopping Experience";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: description,
    icons: {
      icon: siteData?.favicon || "/icon.png",
      apple: siteData?.logo || "/icon.png",
    }
  };
}


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