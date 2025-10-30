"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Variant {
  id: string;
  sku: string;
  title: string;
  price: number | null;
  compareAtPrice?: number | null;
  stock: number;
  image?: string | null;
  attributes: any;
  active: boolean;
}

interface VariantSelectorProps {
  variants: Variant[];
  basePrice: number;
  onVariantChange: (variant: Variant) => void;
}

export function VariantSelector({ variants, basePrice, onVariantChange }: VariantSelectorProps) {
  // Extract unique attribute keys (e.g., storage, color)
  const attributeKeys = variants.length > 0 
    ? Object.keys(variants[0].attributes || {})
    : [];

  // Group variants by attributes
  const attributeOptions: Record<string, Set<string>> = {};
  attributeKeys.forEach(key => {
    attributeOptions[key] = new Set();
    variants.forEach(variant => {
      if (variant.attributes && variant.attributes[key]) {
        attributeOptions[key].add(variant.attributes[key]);
      }
    });
  });

  // Initialize selected attributes
  const initialSelections: Record<string, string> = {};
  attributeKeys.forEach(key => {
    const firstOption = Array.from(attributeOptions[key])[0];
    if (firstOption) {
      initialSelections[key] = firstOption;
    }
  });

  const [selectedAttributes, setSelectedAttributes] = useState(initialSelections);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  // Find matching variant based on selected attributes
  useEffect(() => {
    const matchingVariant = variants.find(variant => {
      if (!variant.attributes) return false;
      return attributeKeys.every(key => 
        variant.attributes[key] === selectedAttributes[key]
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      onVariantChange(matchingVariant);
    }
  }, [selectedAttributes, variants]);

  const handleAttributeChange = (key: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Check if a specific option is available based on current selections
  const isOptionAvailable = (key: string, value: string): boolean => {
    const testSelections = { ...selectedAttributes, [key]: value };
    return variants.some(variant => {
      if (!variant.attributes || !variant.active) return false;
      return attributeKeys.every(attrKey => 
        variant.attributes[attrKey] === testSelections[attrKey]
      ) && variant.stock > 0;
    });
  };

  const displayPrice = selectedVariant?.price || basePrice;
  const comparePrice = selectedVariant?.compareAtPrice;
  const stock = selectedVariant?.stock || 0;

  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Attribute Selectors */}
      {attributeKeys.map(key => (
        <div key={key}>
          <label className="block text-sm font-medium text-slate-700 mb-3 capitalize">
            {key}
          </label>
          <div className="flex flex-wrap gap-2">
            {Array.from(attributeOptions[key]).map(value => {
              const isSelected = selectedAttributes[key] === value;
              const isAvailable = isOptionAvailable(key, value);
              
              return (
                <motion.button
                  key={value}
                  whileHover={isAvailable ? { scale: 1.05 } : {}}
                  whileTap={isAvailable ? { scale: 0.95 } : {}}
                  onClick={() => isAvailable && handleAttributeChange(key, value)}
                  disabled={!isAvailable}
                  className={`
                    relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all
                    ${isSelected 
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2' 
                      : isAvailable
                        ? 'bg-white text-slate-700 border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed opacity-50'
                    }
                  `}
                >
                  {value}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-px w-full bg-slate-400 rotate-[-45deg]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Price & Stock Display */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">
              ${(displayPrice / 100).toFixed(2)}
            </span>
            {comparePrice && comparePrice > displayPrice && (
              <span className="text-lg text-slate-500 line-through">
                ${(comparePrice / 100).toFixed(2)}
              </span>
            )}
          </div>
          {comparePrice && comparePrice > displayPrice && (
            <span className="text-sm text-green-600 font-medium">
              Save ${((comparePrice - displayPrice) / 100).toFixed(2)} (
              {Math.round(((comparePrice - displayPrice) / comparePrice) * 100)}% off)
            </span>
          )}
        </div>
        
        <div className="text-right">
          {stock > 0 ? (
            <>
              <div className="text-sm font-medium text-green-600">In Stock</div>
              <div className="text-xs text-slate-500">
                {stock < 10 ? `Only ${stock} left!` : `${stock} available`}
              </div>
            </>
          ) : (
            <div className="text-sm font-medium text-red-600">Out of Stock</div>
          )}
        </div>
      </div>

      {/* Selected Variant Info */}
      {selectedVariant && (
        <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
          <span className="font-medium">Selected:</span> {selectedVariant.title}
          {selectedVariant.sku && (
            <span className="ml-2 text-blue-600">SKU: {selectedVariant.sku}</span>
          )}
        </div>
      )}
    </div>
  );
}

