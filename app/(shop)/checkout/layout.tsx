import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout",
  // CRITICAL: Prevent search engines from indexing the checkout process
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
