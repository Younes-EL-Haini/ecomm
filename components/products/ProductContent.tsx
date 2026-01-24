import { Decimal } from "@prisma/client/runtime/library";
import Link from "next/link";
import { CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { formatMoney, toNumber } from "@/lib/utils/pricing";

type ProductContentProps = {
  title: string;
  description: string;
  price: Decimal; // or Decimal.toNumber()
  slug: string;
};

const ProductContent = ({
  title,
  description,
  price,
  slug,
}: ProductContentProps) => {
  return (
    <CardContent className="flex flex-1 flex-col p-4">
      {/* CONTENT */}
      <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>

      {/* FOOTER */}
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-lg font-bold text-blue-600">
          {formatMoney(toNumber(price))}
        </span>
        <Link href={`/products/${slug}`}>
          <Button
            variant="outline"
            className="px-3 py-1 text-sm font-medium border rounded hover:bg-blue-600 hover:text-white transition"
          >
            View
          </Button>
        </Link>
      </div>
    </CardContent>
  );
};

export default ProductContent;
