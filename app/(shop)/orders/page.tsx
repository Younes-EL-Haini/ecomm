// // src/app/orders/page.tsx
// import prisma from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import Image from "next/image";
// import Link from "next/link";
// import authOptions from "../auth/authOptions"; // adjust path if needed

// const OrdersPage = async () => {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return (
//       <div className="p-10 text-center">
//         <p className="text-lg font-medium">
//           You must be logged in to view orders.
//         </p>
//       </div>
//     );
//   }

//   const orders = await prisma.order.findMany({
//     where: {
//       userId: session.user.id,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//     include: {
//       items: {
//         include: {
//           product: {
//             include: {
//               images: {
//                 take: 1,
//                 orderBy: { position: "asc" },
//               },
//             },
//           },
//           variant: true,
//         },
//       },
//     },
//   });

//   return (
//     <div className="max-w-6xl mx-auto px-4 md:px-10 py-10">
//       <h1 className="text-3xl font-bold mb-8">My Orders</h1>

//       {orders.length === 0 ? (
//         <p className="text-gray-500">You have no orders yet.</p>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => (
//             <div
//               key={order.id}
//               className="rounded-2xl border bg-white p-6 shadow-sm"
//             >
//               {/* Order header */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
//                 <div>
//                   <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
//                   <p className="text-sm text-gray-500">
//                     {order.createdAt.toDateString()}
//                   </p>
//                 </div>

//                 <span
//                   className={`w-fit rounded-full px-3 py-1 text-xs font-medium text-white ${
//                     order.status === "PAID" ? "bg-green-600" : "bg-yellow-500"
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//               </div>

//               {/* Items */}
//               <div className="divide-y">
//                 {order.items.map((item) => (
//                   <div key={item.id} className="flex gap-4 py-4 items-center">
//                     <div className="relative h-20 w-16 overflow-hidden rounded-lg bg-gray-100">
//                       <Image
//                         src={
//                           item.product.images[0]?.url ||
//                           "/images/hero-product.jpg"
//                         }
//                         alt={item.product.title}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>

//                     <div className="flex-1">
//                       <Link
//                         href={`/products/${item.product.slug}`}
//                         className="font-medium hover:underline"
//                       >
//                         {item.product.title}
//                       </Link>

//                       {item.variant && (
//                         <p className="text-sm text-gray-500">
//                           Variant: {item.variant.name}
//                         </p>
//                       )}

//                       <p className="text-sm text-gray-500">
//                         Qty: {item.quantity}
//                       </p>
//                     </div>

//                     <div className="font-semibold">
//                       ${item.totalPrice.toFixed(2)}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Total */}
//               <div className="flex justify-end pt-4">
//                 <p className="text-lg font-bold">
//                   Total: ${order.totalPrice.toFixed(2)}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdersPage;

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import OrderCard from "@/components/orders/OrderCard";
import Link from "next/link";

const OrdersPage = async () => {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return <p className="p-10">Please log in to view orders.</p>;
  }

  const orders = await prisma.order.findMany({
    where: {
      user: { email: session.user.email },
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { take: 1 },
            },
          },
          variant: true,
        },
      },
    },
  });

  return (
    <div className="px-4 md:px-10 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-500 mb-4">
            You haven't placed any orders yet.
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
