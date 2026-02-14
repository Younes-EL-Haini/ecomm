import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team for support and inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN: Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter uppercase italic text-zinc-900">
                Get in Touch
              </h1>
              <p className="mt-4 text-zinc-500">
                Have a question about an order or a product? Our team is here to
                help you.
              </p>
            </div>

            <div className="space-y-6">
              <ContactInfoItem
                icon={<Mail className="w-5 h-5" />}
                title="Email Us"
                detail="support@yourstore.com"
              />
              <ContactInfoItem
                icon={<Phone className="w-5 h-5" />}
                title="Call Us"
                detail="+212 5XX-XXXXXX"
              />
              <ContactInfoItem
                icon={<MapPin className="w-5 h-5" />}
                title="Visit Us"
                detail="123 Fashion Ave, Fes, Morocco"
              />
              <ContactInfoItem
                icon={<Clock className="w-5 h-5" />}
                title="Hours"
                detail="Mon - Fri: 9am - 6pm"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-4xl p-8 md:p-12 shadow-sm border border-zinc-100">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-zinc-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-zinc-50"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Order Inquiry"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-zinc-50"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-zinc-50 resize-none"
                  ></textarea>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    className="w-full md:w-max px-10 py-4 bg-zinc-900 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all active:scale-95 shadow-lg"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfoItem({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-white rounded-2xl shadow-sm border border-zinc-100 text-zinc-900">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
        <p className="text-sm text-zinc-500">{detail}</p>
      </div>
    </div>
  );
}
