import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartItemControls from "./CartItemControls";

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return <div className="p-10 text-center">Please login...</div>;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      cartItems: {
        include: {
          product: { include: { images: true } }, // Include images!
          variant: true,
        },
      },
    },
  });

  const cartItems = user?.cartItems || [];
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 border rounded-lg">
          <p className="text-muted-foreground mb-4">Your cart is empty.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT: ITEM LIST */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-6">
                <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-lg overflow-hidden border bg-white shrink-0 shadow-sm group">
                  <Image
                    src={item.product.images[0]?.url || "/placeholder.png"}
                    alt={item.product.title}
                    fill
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                  />

                  {/* Hover overlay (desktop only) */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
                    <span className="text-white text-xs font-medium tracking-wide">
                      View
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-semibold hover:underline"
                  >
                    {item.product.title}
                  </Link>
                  {item.variant && (
                    <p className="text-sm text-muted-foreground">
                      Size: {item.variant.size} | Color: {item.variant.color}
                    </p>
                  )}
                  <p className="mt-2 font-medium">
                    {Number(item.product.price).toFixed(2)} MAD
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  {/* We will add a Client Component here for + / - buttons later */}
                  <div className="flex flex-col items-end justify-between gap-4">
                    {/* Pass the item ID and quantity to the client controls */}
                    <CartItemControls
                      itemId={item.id}
                      initialQuantity={item.quantity}
                      productId={item.productId}
                      variantId={item.variantId || ""}
                    />

                    <p className="font-bold text-lg">
                      {(Number(item.product.price) * item.quantity).toFixed(2)}{" "}
                      MAD
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="bg-muted/30 p-6 rounded-lg h-fit space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="flex justify-between border-b pb-2">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{subtotal.toFixed(2)} MAD</span>
            </div>
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
