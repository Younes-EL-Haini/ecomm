import { Decimal } from "@prisma/client/runtime/library";
import { CardContent } from "../ui/card";
import { formatMoney, toNumber } from "@/lib/utils/pricing";

type ProductContentProps = {
  title: string;
  description: string;
  price: Decimal; // or Decimal.toNumber()
  slug: string;
};

const ProductContent = ({ title, price }: ProductContentProps) => {
  return (
    <CardContent className="flex flex-1 flex-col p-4">
      {/* CONTENT */}

      <h3 className="text-lg font-semibold text-zinc-900 tracking-tight transition-colors duration-300 group-hover:text-blue-600">
        {title}
      </h3>

      {/* FOOTER */}
      <div className="mt-auto flex items-center justify-between pt-6">
        <span className="text-sm font-medium text-black">
          {formatMoney(toNumber(price))}
        </span>
      </div>
    </CardContent>
  );
};

export default ProductContent;
