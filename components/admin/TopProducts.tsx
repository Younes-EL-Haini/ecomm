import { Box } from "lucide-react";

interface TopProductsProps {
  products: {
    id: string;
    title: string;
    price: any;
    images?: any;
    quantitySold: number;
  }[];
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Box className="w-5 h-5 text-indigo-500" />
        <h3 className="font-bold text-gray-900">Top Selling Products</h3>
      </div>

      <div className="space-y-6 flex-1">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-400 w-4">
              {index + 1}
            </span>

            <div className="flex-1 min-w-0">
              {/* NOW USING THE ACTUAL TITLE */}
              <p className="text-sm font-semibold text-gray-900 truncate">
                {product.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${(product.quantitySold / products[0].quantitySold) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {product.quantitySold} sold
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
