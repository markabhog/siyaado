"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Category-specific field templates
const CATEGORY_TEMPLATES = {
  books: {
    attributes: [
      { key: 'author', label: 'Author', type: 'text', required: true },
      { key: 'isbn', label: 'ISBN', type: 'text', required: true },
      { key: 'publisher', label: 'Publisher', type: 'text' },
      { key: 'pages', label: 'Number of Pages', type: 'number' },
      { key: 'language', label: 'Language', type: 'text' },
      { key: 'format', label: 'Format', type: 'select', options: ['Hardcover', 'Paperback', 'eBook', 'Audiobook'] },
      { key: 'publicationDate', label: 'Publication Date', type: 'date' },
      { key: 'genre', label: 'Genre', type: 'text' }
    ]
  },
  electronics: {
    attributes: [
      { key: 'brand', label: 'Brand', type: 'text', required: true },
      { key: 'model', label: 'Model Number', type: 'text' },
      { key: 'processor', label: 'Processor', type: 'text' },
      { key: 'ram', label: 'RAM', type: 'text' },
      { key: 'storage', label: 'Storage', type: 'text' },
      { key: 'display', label: 'Display', type: 'text' },
      { key: 'battery', label: 'Battery Life', type: 'text' },
      { key: 'connectivity', label: 'Connectivity', type: 'text' },
      { key: 'os', label: 'Operating System', type: 'text' },
      { key: 'warranty', label: 'Warranty', type: 'text' }
    ]
  },
  furniture: {
    attributes: [
      { key: 'material', label: 'Material', type: 'text', required: true },
      { key: 'dimensions', label: 'Dimensions (L x W x H)', type: 'text' },
      { key: 'weight', label: 'Weight (kg)', type: 'number' },
      { key: 'color', label: 'Color', type: 'text' },
      { key: 'style', label: 'Style', type: 'text' },
      { key: 'assembly', label: 'Assembly Required', type: 'select', options: ['Yes', 'No'] },
      { key: 'roomType', label: 'Room Type', type: 'text' },
      { key: 'careInstructions', label: 'Care Instructions', type: 'textarea' }
    ]
  },
  beauty: {
    attributes: [
      { key: 'brand', label: 'Brand', type: 'text', required: true },
      { key: 'volume', label: 'Volume/Size', type: 'text' },
      { key: 'skinType', label: 'Skin Type', type: 'text' },
      { key: 'ingredients', label: 'Key Ingredients', type: 'textarea' },
      { key: 'benefits', label: 'Benefits', type: 'textarea' },
      { key: 'isNatural', label: 'Natural', type: 'checkbox' },
      { key: 'isCrueltyFree', label: 'Cruelty-Free', type: 'checkbox' },
      { key: 'isVegan', label: 'Vegan', type: 'checkbox' },
      { key: 'expiryDate', label: 'Expiry Date', type: 'date' }
    ]
  },
  clothing: {
    attributes: [
      { key: 'brand', label: 'Brand', type: 'text', required: true },
      { key: 'fabric', label: 'Fabric', type: 'text' },
      { key: 'fit', label: 'Fit', type: 'select', options: ['Regular', 'Slim', 'Loose', 'Oversized'] },
      { key: 'occasion', label: 'Occasion', type: 'text' },
      { key: 'season', label: 'Season', type: 'select', options: ['All Season', 'Summer', 'Winter', 'Spring', 'Fall'] },
      { key: 'careInstructions', label: 'Care Instructions', type: 'textarea' },
      { key: 'countryOfOrigin', label: 'Country of Origin', type: 'text' }
    ]
  },
  fitness: {
    attributes: [
      { key: 'brand', label: 'Brand', type: 'text', required: true },
      { key: 'equipmentType', label: 'Equipment Type', type: 'text' },
      { key: 'weightRange', label: 'Weight Range', type: 'text' },
      { key: 'material', label: 'Material', type: 'text' },
      { key: 'dimensions', label: 'Dimensions', type: 'text' },
      { key: 'maxWeight', label: 'Max Weight Capacity', type: 'text' },
      { key: 'warranty', label: 'Warranty', type: 'text' }
    ]
  }
};

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Basic fields
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  
  // Dynamic attributes based on category
  const [attributes, setAttributes] = useState<Record<string, any>>({});
  
  // Get template for selected category
  const template = category ? CATEGORY_TEMPLATES[category as keyof typeof CATEGORY_TEMPLATES] : null;

  const handleAttributeChange = (key: string, value: any) => {
    setAttributes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Generate slug from title
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const productData = {
        sku,
        title,
        slug,
        description,
        price: parseInt(price) * 100, // Convert to cents
        stock: parseInt(stock),
        images: images.filter(img => img.trim()),
        attributes,
        categories: [category],
        active: true
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: any) => {
    const value = attributes[field.key] || '';

    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleAttributeChange(field.key, e.target.value)}
            required={field.required}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleAttributeChange(field.key, e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleAttributeChange(field.key, e.target.value)}
            required={field.required}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select...</option>
            {field.options?.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => handleAttributeChange(field.key, e.target.checked)}
            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
        <p className="text-slate-600 mt-2">Fill in the product details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., iPhone 15 Pro Max"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., IPHONE-15-PRO-MAX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed product description..."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="29.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setAttributes({}); // Reset attributes when category changes
                }}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="books">Books</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="beauty">Beauty & Personal Care</option>
                <option value="clothing">Clothing</option>
                <option value="fitness">Fitness & Sports</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Images (URLs)
            </label>
            {images.map((img, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={img}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index] = e.target.value;
                    setImages(newImages);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                {index === images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setImages([...images, ''])}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Category-Specific Attributes */}
        {template && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 p-6 space-y-6"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              {category.charAt(0).toUpperCase() + category.slice(1)} Specific Details
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {template.attributes.map((field) => (
                <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`
              flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-colors
              ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

