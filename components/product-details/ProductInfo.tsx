import { useProductVariants } from "./useProductVariants";
import VariantPicker from "./VariantPicker";
import { cn } from "@/lib/utils";
import { formatMoney, calculateVariantPrice } from "@/lib/utils/pricing";
import { ProductFullDetails } from "@/lib/products";
import AddToCartActions from "../products/AddToCartActions";

interface Props {
  product: ProductFullDetails;
  onColorChange: (color: string | null) => void;
}

const ProductInfo = ({ product, onColorChange }: Props) => {
  const {
    selectedSize,
    selectedColor,
    handleSizeChange,
    handleColorChange,
    selectedVariant,
    availableSizes,
    sizes,
    colors,
  } = useProductVariants(product.variants, onColorChange);

  // Specific variant stock check
  const variantInStock = selectedVariant && selectedVariant.stock > 0;

  return (
    <div className="space-y-6">
      {/* TITLE & RATING */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
          {product.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>⭐ {product.avgRating || "0.0"}</span>
          <span>•</span>
          <span>{product.ratingCount || 0} reviews</span>
        </div>
      </div>

      <p className="text-2xl font-semibold text-primary">
        {formatMoney(
          calculateVariantPrice(product.price, selectedVariant?.priceDelta),
          "MAD", // Since you are using MAD
        )}
      </p>

      {/* STOCK STATUS */}
      <p
        className={cn(
          "text-sm font-medium",
          variantInStock ? "text-green-600" : "text-red-600",
        )}
      >
        {variantInStock ? "In stock" : "Out of stock"}
      </p>

      {/* VARIANTS */}
      <div className="space-y-4">
        {sizes.length > 0 && (
          <VariantPicker
            label="Size"
            options={sizes}
            selected={selectedSize}
            available={availableSizes}
            onSelect={handleSizeChange} // Use the custom handler
          />
        )}
        {colors.length > 0 && (
          <VariantPicker
            label="Color"
            options={colors}
            selected={selectedColor}
            available={colors} // Keep all colors clickable, let the handler snap the size
            onSelect={handleColorChange} // Use the custom handler
            isColor
          />
        )}
      </div>

      {/* LOW STOCK WARNING */}
      {selectedVariant &&
        selectedVariant.stock <= 5 &&
        selectedVariant.stock > 0 && (
          <p className="text-sm text-orange-600 font-medium">
            ⚠️ Only {selectedVariant.stock} left in stock
          </p>
        )}

      <AddToCartActions
        productId={product.id}
        variantId={selectedVariant?.id || null}
        disabled={!variantInStock}
      />

      <div className="border-t pt-6 text-sm text-muted-foreground leading-relaxed">
        {product.description}
      </div>
    </div>
  );
};

export default ProductInfo;
