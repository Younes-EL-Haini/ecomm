import Link from "next/link";
import Image from "next/image";
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
  const domainName = SITE_CONFIG.name.toLowerCase().replace(/\s+/g, "");

  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link
              href="/"
              className="text-2xl font-black text-white tracking-tighter uppercase italic"
            >
              {SITE_CONFIG.name}
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-sm">
              Elevating your lifestyle with curated premium goods. Quality meets
              craftsmanship in every piece we deliver.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-white text-zinc-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="hover:text-white text-zinc-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="hover:text-white text-zinc-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-6">
              Shop
            </h3>
            <ul className="space-y-3.5 text-sm text-zinc-400">
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

          {/* Support Links */}
          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-6">
              Support
            </h3>
            <ul className="space-y-3.5 text-sm text-zinc-400">
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

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-6">
              Contact
            </h3>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-zinc-500 mt-0.5" />
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
                <a
                  href={`mailto:elhaini.youness@gmail.com`}
                  className="hover:text-white transition-colors"
                >
                  elhaini.youness@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs text-zinc-500">
            © {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>

          {/* Payment Badges */}
          <div className="flex items-center gap-5 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
              width={40}
              height={12}
              className="h-3 w-auto object-contain"
            />
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              width={32}
              height={20}
              className="h-5 w-auto object-contain"
            />
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
              alt="Stripe"
              width={42}
              height={16}
              className="h-4 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
