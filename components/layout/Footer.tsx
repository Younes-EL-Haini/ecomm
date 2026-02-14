import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link
              href="/"
              className="text-2xl font-bold text-white tracking-tighter uppercase italic"
            >
              {SITE_CONFIG.name}
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
              Elevating your lifestyle with curated premium goods. Quality meets
              craftsmanship in every piece we deliver.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-6">
              Shop
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=new"
                  className="hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=featured"
                  className="hover:text-white transition-colors"
                >
                  Featured
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-white transition-colors"
                >
                  Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-6">
              Support
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/account/orders"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-white transition-colors"
                >
                  Customer Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-6">
              Contact
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-zinc-500" />
                <span>
                  123 Fashion Ave,
                  <br />
                  Fes, Morocco
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-zinc-500" />
                <span>+212 5XX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-zinc-500" />
                <span>hello@{SITE_CONFIG.name.toLowerCase()}.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-zinc-500">
            © {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>

          {/* Payment Icons Placeholder */}
          <div className="flex items-center gap-4 grayscale opacity-50">
            <img src="/icons/visa.svg" alt="Visa" className="h-4" />
            <img src="/icons/mastercard.svg" alt="Mastercard" className="h-6" />
            <img src="/icons/stripe.svg" alt="Stripe" className="h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
