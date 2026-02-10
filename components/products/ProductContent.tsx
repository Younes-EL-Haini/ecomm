// import { Decimal } from "@prisma/client/runtime/library";
// import { CardContent } from "../ui/card";
// import { formatMoney, toNumber } from "@/lib/utils/pricing";

// type ProductContentProps = {
//   title: string;
//   description: string;
//   price: Decimal; // or Decimal.toNumber()
//   slug: string;
// };

// const ProductContent = ({ title, price }: ProductContentProps) => {
//   return (
//     <CardContent className="flex flex-1 flex-col p-4">
//       {/* CONTENT */}

//       <h3 className="text-lg font-semibold text-zinc-900 tracking-tight transition-colors duration-300 group-hover:text-blue-600">
//         {title}
//       </h3>

//       {/* FOOTER */}
//       <div className="mt-auto flex items-center justify-between pt-6">
//         <span className="text-sm font-medium text-black">
//           {formatMoney(toNumber(price))}
//         </span>
//       </div>
//     </CardContent>
//   );
// };

// export default ProductContent;

import { Decimal } from "@prisma/client/runtime/library";
import { CardContent } from "../ui/card";
import { formatMoney, toNumber } from "@/lib/utils/pricing";

type ProductContentProps = {
  title: string;
  description: string;
  price: Decimal;
  slug: string;
  categoryName?: string; // Added for a more "Production" feel
};

const ProductContent = ({
  title,
  price,
  categoryName = "Apparel",
}: ProductContentProps) => {
  return (
    <CardContent className="flex flex-1 flex-col p-5">
      {/* 1. Category Label: Adds density and context */}
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        {categoryName}
      </p>

      {/* 2. Title: Larger, primary focus, and tighter line height */}
      <h3 className="line-clamp-1 text-base font-semibold leading-tight text-zinc-900 transition-colors duration-300 group-hover:text-blue-600">
        {title}
      </h3>

      {/* 3. Footer: Refined spacing and color contrast */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-col">
          {/* Price is now slightly smaller (text-sm) and muted (text-zinc-600) */}
          <span className="text-sm font-medium text-zinc-600">
            {formatMoney(toNumber(price))}
          </span>
        </div>

        {/* Optional: Add a subtle 'View' indicator that appears on hover */}
        <span className="text-[10px] font-bold uppercase text-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          View Details
        </span>
      </div>
    </CardContent>
  );
};

export default ProductContent;
