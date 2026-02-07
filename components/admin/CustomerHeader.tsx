"use client";

import Image from "next/image";
import { Mail, Calendar, ShieldCheck, User, ChevronLeft } from "lucide-react";
import { CustomerHeaderData } from "@/lib/admin/admin.types";
import Link from "next/link";

export function CustomerHeader({ customer }: { customer: CustomerHeaderData }) {
  return (
    <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
      <Link
        href="/admin/customers"
        className="text-sm text-slate-500 hover:text-black flex items-center gap-2 mb-4 transition-colors"
      >
        <ChevronLeft size={16} /> Back to Customers
      </Link>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar Section */}
        <div className="relative h-24 w-24 rounded-3xl border-4 border-slate-50 overflow-hidden bg-slate-100 shadow-inner shrink-0">
          {customer.image ? (
            <Image
              src={customer.image}
              alt={customer.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-400 bg-slate-50">
              <User size={40} />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900">
              {customer.name}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                customer.status === "Verified"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-amber-50 text-amber-600 border border-amber-100"
              }`}
            >
              {customer.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Mail size={16} className="text-slate-400" />
              {customer.email}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-slate-400" />
              Joined {customer.joinedDate}
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-indigo-400" />
              Customer ID: {customer.id?.slice(-6).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
