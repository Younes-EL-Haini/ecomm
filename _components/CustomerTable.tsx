// "use client";

// import {
//   MoreHorizontal,
//   Mail,
//   Calendar,
//   ShoppingBag,
//   ChevronRight,
//   Users,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Image from "next/image";
// import Link from "next/link";
// import { CustomerTableProps } from "@/lib/admin/admin.types";

// export default function CustomerTable({ data }: CustomerTableProps) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full text-sm text-left">
//         <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50 border-b">
//           <tr>
//             <th className="px-6 py-4 font-semibold">Customer</th>
//             <th className="px-6 py-4 font-semibold text-center">Status</th>
//             <th className="px-6 py-4 font-semibold">Joined</th>
//             <th className="px-6 py-4 font-semibold text-center">Orders</th>
//             <th className="px-6 py-4 font-semibold text-right">Total Spent</th>
//             <th className="w-10 px-6"></th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100">
//           {data.map((customer) => (
//             <tr
//               key={customer.id}
//               className="hover:bg-slate-50/80 transition-colors group"
//             >
//               {/* Name & Email */}
//               <td className="px-6 py-4">
//                 <div className="flex items-center gap-3">
//                   {/* <div className="relative h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200"> */}
//                   <div className="relative h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 overflow-hidden">
//                     {/* {customer.name.charAt(0)} */}
//                     <Image
//                       src={customer.image || "/placeholder.png"}
//                       alt={customer.name || "User"}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="font-bold text-slate-900">
//                       {customer.name}
//                     </span>
//                     <span className="text-xs text-slate-500 flex items-center gap-1">
//                       <Mail size={12} /> {customer.email}
//                     </span>
//                   </div>
//                 </div>
//               </td>

//               {/* Status Badge */}
//               <td className="px-6 py-4 text-center">
//                 <span
//                   className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
//                     customer.status === "Verified"
//                       ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
//                       : "bg-amber-50 text-amber-600 border border-amber-100"
//                   }`}
//                 >
//                   {customer.status}
//                 </span>
//               </td>

//               {/* Joined Date */}
//               <td className="px-6 py-4 text-slate-600 font-medium">
//                 <div className="flex items-center gap-2">
//                   <Calendar size={14} className="text-slate-400" />
//                   {customer.joinedDate}
//                 </div>
//               </td>

//               {/* Order Count */}
//               <td className="px-6 py-4 text-center">
//                 <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs">
//                   <ShoppingBag size={12} />
//                   {customer.totalOrders}
//                 </div>
//               </td>

//               {/* Total Spent */}
//               <td className="px-6 py-4 text-right">
//                 <span className="font-bold text-slate-900">
//                   $
//                   {customer.totalSpent.toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                   })}
//                 </span>
//               </td>

//               {/* Actions */}
//               <td className="px-6 py-4 text-right">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-slate-900">
//                       <MoreHorizontal size={16} />
//                     </button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-48">
//                     <DropdownMenuLabel>Actions</DropdownMenuLabel>

//                     <DropdownMenuItem asChild className="cursor-pointer">
//                       <Link href={`/admin/customers/${customer.id}`}>
//                         View Profile
//                       </Link>
//                     </DropdownMenuItem>

//                     <DropdownMenuItem className="cursor-pointer text-rose-600">
//                       Suspend Account
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {data.length === 0 && (
//         <div className="p-20 text-center flex flex-col items-center justify-center text-slate-400">
//           <Users size={48} className="mb-4 opacity-20" />
//           <p>No customers found.</p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import {
  MoreHorizontal,
  Mail,
  Calendar,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { CustomerTableProps } from "@/lib/admin/admin.types";

export default function CustomerTable({ data }: CustomerTableProps) {
  if (data.length === 0) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center text-slate-400">
        <Users size={48} className="mb-4 opacity-20" />
        <p>No customers found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* --- MOBILE & TABLET VIEW (Cards) --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden pb-10">
        {data.map((customer) => (
          <div
            key={customer.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="relative h-12 w-12 rounded-full border overflow-hidden shrink-0">
                <Image
                  src={customer.image || "/placeholder.png"}
                  alt={customer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-slate-900 truncate">
                  {customer.name}
                </span>
                <span className="text-xs text-slate-500 truncate">
                  {customer.email}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <CustomerActions id={customer.id} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 pt-3 border-t border-slate-50">
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-bold">
                  Status
                </p>
                <span
                  className={`text-[10px] font-bold uppercase ${customer.status === "Verified" ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {customer.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-slate-400 font-bold">
                  Orders
                </p>
                <p className="text-xs font-bold">
                  {customer.totalOrders} items
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-bold">
                  Spent
                </p>
                <p className="text-sm font-black text-slate-900">
                  $
                  {customer.totalSpent.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="text-right flex justify-end items-end">
                <Link
                  href={`/admin/customers/${customer.id}`}
                  className="text-xs font-bold text-indigo-600"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- DESKTOP VIEW (Full Table) --- */}
      <div className="hidden md:block overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold">Joined</th>
              <th className="px-6 py-4 font-semibold text-center">Orders</th>
              <th className="px-6 py-4 font-semibold text-right">
                Total Spent
              </th>
              <th className="w-10 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full bg-slate-100 border overflow-hidden">
                      <Image
                        src={customer.image || "/placeholder.png"}
                        alt={customer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">
                        {customer.name}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail size={12} /> {customer.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${customer.status === "Verified" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"} border`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />{" "}
                    {customer.joinedDate}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs">
                    <ShoppingBag size={12} /> {customer.totalOrders}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-slate-900">
                    $
                    {customer.totalSpent.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <CustomerActions id={customer.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Sub-component to keep code DRY
function CustomerActions({ id }: { id: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-slate-900">
          <MoreHorizontal size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/admin/customers/${id}`}>View Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-rose-600">
          Suspend Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
