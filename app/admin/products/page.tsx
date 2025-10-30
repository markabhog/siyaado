"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui";
import Image from "next/image";
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  CheckCircle2,
  Clock8,
  Package
} from "lucide-react";

const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ');

// Category-specific field templates
const CATEGORY_TEMPLATES: Record<string, { key: string; label: string; type: string; options?: string[]; required?: boolean }[]> = {
  // Books & Education
  'books': [
    { key: 'author', label: 'Author', type: 'text', required: true },
    { key: 'isbn', label: 'ISBN', type: 'text' },
    { key: 'publisher', label: 'Publisher', type: 'text' },
    { key: 'pages', label: 'Number of Pages', type: 'number' },
    { key: 'language', label: 'Language', type: 'text' },
    { key: 'format', label: 'Format', type: 'select', options: ['Hardcover', 'Paperback', 'eBook', 'Audiobook'] },
    { key: 'publicationDate', label: 'Publication Date', type: 'date' },
    { key: 'genre', label: 'Genre', type: 'text' }
  ],
  'stationery': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'quantity', label: 'Quantity/Pack Size', type: 'text' },
    { key: 'dimensions', label: 'Dimensions', type: 'text' }
  ],
  'learning-kits': [
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'ageRange', label: 'Age Range', type: 'text', required: true },
    { key: 'subject', label: 'Subject/Topic', type: 'text' },
    { key: 'includes', label: 'What\'s Included', type: 'textarea' }
  ],
  'education-materials': [
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'subject', label: 'Subject', type: 'text' },
    { key: 'gradeLevel', label: 'Grade Level', type: 'text' },
    { key: 'material', label: 'Material', type: 'text' }
  ],
  
  // Electronics - General
  'electronics': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model Number', type: 'text' },
    { key: 'warranty', label: 'Warranty', type: 'text' },
    { key: 'connectivity', label: 'Connectivity', type: 'text' },
    { key: 'powerSource', label: 'Power Source', type: 'text' }
  ],
  'consumer-electronics': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model Number', type: 'text' },
    { key: 'warranty', label: 'Warranty', type: 'text' },
    { key: 'features', label: 'Key Features', type: 'textarea' }
  ],
  
  // Phones
  'phones': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model', type: 'text', required: true },
    { key: 'processor', label: 'Processor/Chipset', type: 'text' },
    { key: 'ram', label: 'RAM', type: 'text' },
    { key: 'storage', label: 'Internal Storage', type: 'text' },
    { key: 'display', label: 'Display Size & Type', type: 'text' },
    { key: 'displayResolution', label: 'Display Resolution', type: 'text' },
    { key: 'camera', label: 'Camera (Main/Front)', type: 'text' },
    { key: 'battery', label: 'Battery Capacity', type: 'text' },
    { key: 'os', label: 'Operating System', type: 'text' },
    { key: 'connectivity', label: 'Connectivity (5G/4G/Wi-Fi)', type: 'text' },
    { key: 'simType', label: 'SIM Type', type: 'select', options: ['Single SIM', 'Dual SIM', 'eSIM', 'Dual SIM + eSIM'] },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  
  // Laptops
  'laptops': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model', type: 'text', required: true },
    { key: 'processor', label: 'Processor', type: 'text', required: true },
    { key: 'ram', label: 'RAM', type: 'text', required: true },
    { key: 'storage', label: 'Storage', type: 'text', required: true },
    { key: 'storageType', label: 'Storage Type', type: 'select', options: ['SSD', 'HDD', 'SSD + HDD', 'NVMe SSD'] },
    { key: 'display', label: 'Display Size', type: 'text' },
    { key: 'displayResolution', label: 'Display Resolution', type: 'text' },
    { key: 'graphics', label: 'Graphics Card', type: 'text' },
    { key: 'os', label: 'Operating System', type: 'text' },
    { key: 'battery', label: 'Battery Life', type: 'text' },
    { key: 'weight', label: 'Weight (kg)', type: 'number' },
    { key: 'ports', label: 'Ports & Connectivity', type: 'textarea' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  
  // Watches
  'watches': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'type', label: 'Type', type: 'select', options: ['Smart Watch', 'Analog', 'Digital', 'Hybrid'] },
    { key: 'display', label: 'Display', type: 'text' },
    { key: 'battery', label: 'Battery Life', type: 'text' },
    { key: 'waterResistance', label: 'Water Resistance', type: 'text' },
    { key: 'compatibility', label: 'Compatible With', type: 'text' },
    { key: 'features', label: 'Key Features', type: 'textarea' },
    { key: 'strapMaterial', label: 'Strap Material', type: 'text' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  
  // Accessories
  'accessories': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'compatibleWith', label: 'Compatible With', type: 'text' },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'features', label: 'Features', type: 'textarea' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  
  // Fashion & Clothing
  'fashion-clothing': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'fabric', label: 'Fabric/Material', type: 'text', required: true },
    { key: 'fit', label: 'Fit', type: 'select', options: ['Regular', 'Slim', 'Loose', 'Oversized', 'Tailored'] },
    { key: 'occasion', label: 'Occasion', type: 'text' },
    { key: 'season', label: 'Season', type: 'select', options: ['All Season', 'Summer', 'Winter', 'Spring', 'Fall'] },
    { key: 'careInstructions', label: 'Care Instructions', type: 'textarea' },
    { key: 'countryOfOrigin', label: 'Country of Origin', type: 'text' }
  ],
  'men': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'fabric', label: 'Fabric', type: 'text' },
    { key: 'fit', label: 'Fit', type: 'select', options: ['Regular', 'Slim', 'Loose', 'Athletic'] },
    { key: 'neckline', label: 'Neckline/Collar', type: 'text' },
    { key: 'careInstructions', label: 'Care Instructions', type: 'text' }
  ],
  'women': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'fabric', label: 'Fabric', type: 'text' },
    { key: 'fit', label: 'Fit', type: 'select', options: ['Regular', 'Slim', 'Loose', 'A-Line', 'Bodycon'] },
    { key: 'neckline', label: 'Neckline', type: 'text' },
    { key: 'careInstructions', label: 'Care Instructions', type: 'text' }
  ],
  'kids': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'fabric', label: 'Fabric', type: 'text' },
    { key: 'ageRange', label: 'Age Range', type: 'text', required: true },
    { key: 'gender', label: 'Gender', type: 'select', options: ['Boys', 'Girls', 'Unisex'] },
    { key: 'careInstructions', label: 'Care Instructions', type: 'text' }
  ],
  
  // Baby Supplies
  'baby-supplies': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'ageRange', label: 'Age Range', type: 'text', required: true },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'safetyStandards', label: 'Safety Standards', type: 'text' },
    { key: 'careInstructions', label: 'Care Instructions', type: 'textarea' }
  ],
  'diapers': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'size', label: 'Size', type: 'select', options: ['Newborn', 'Small', 'Medium', 'Large', 'XL', 'XXL'], required: true },
    { key: 'weightRange', label: 'Weight Range', type: 'text' },
    { key: 'count', label: 'Count per Pack', type: 'number' },
    { key: 'features', label: 'Features', type: 'textarea' }
  ],
  'feeding': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'ageRange', label: 'Age Range', type: 'text' },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'capacity', label: 'Capacity', type: 'text' },
    { key: 'bpaFree', label: 'BPA Free', type: 'checkbox' }
  ],
  'strollers': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'type', label: 'Type', type: 'select', options: ['Standard', 'Lightweight', 'Jogging', 'Travel System', 'Double'] },
    { key: 'ageRange', label: 'Age Range', type: 'text' },
    { key: 'weightCapacity', label: 'Weight Capacity', type: 'text' },
    { key: 'foldable', label: 'Foldable', type: 'checkbox' },
    { key: 'features', label: 'Features', type: 'textarea' }
  ],
  
  // Home & Kitchen
  'home-kitchen': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'material', label: 'Material', type: 'text', required: true },
    { key: 'dimensions', label: 'Dimensions', type: 'text' },
    { key: 'capacity', label: 'Capacity/Size', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'dishwasherSafe', label: 'Dishwasher Safe', type: 'checkbox' },
    { key: 'careInstructions', label: 'Care Instructions', type: 'textarea' }
  ],
  
  // Beauty & Personal Care
  'beauty-personal-care': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'volume', label: 'Volume/Size', type: 'text', required: true },
    { key: 'skinType', label: 'Suitable for Skin Type', type: 'select', options: ['All', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'] },
    { key: 'ingredients', label: 'Key Ingredients', type: 'textarea' },
    { key: 'benefits', label: 'Benefits', type: 'textarea' },
    { key: 'howToUse', label: 'How to Use', type: 'textarea' },
    { key: 'isNatural', label: 'Natural/Organic', type: 'checkbox' },
    { key: 'isCrueltyFree', label: 'Cruelty-Free', type: 'checkbox' },
    { key: 'isVegan', label: 'Vegan', type: 'checkbox' },
    { key: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { key: 'madeIn', label: 'Made In', type: 'text' }
  ],
  
  // Sports & Outdoor & Fitness
  'sports-outdoor': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'sport', label: 'Sport/Activity', type: 'text' },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'size', label: 'Size/Dimensions', type: 'text' },
    { key: 'weight', label: 'Weight', type: 'text' },
    { key: 'features', label: 'Features', type: 'textarea' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  'fitness-sports': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'type', label: 'Equipment Type', type: 'text', required: true },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'weight', label: 'Weight', type: 'text' },
    { key: 'maxWeight', label: 'Max Weight Capacity', type: 'text' },
    { key: 'dimensions', label: 'Dimensions', type: 'text' },
    { key: 'features', label: 'Features', type: 'textarea' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  
  // Furniture
  'furniture': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'material', label: 'Material', type: 'text', required: true },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'dimensions', label: 'Dimensions (L x W x H)', type: 'text', required: true },
    { key: 'weight', label: 'Weight', type: 'text' },
    { key: 'assembly', label: 'Assembly Required', type: 'select', options: ['Yes', 'No', 'Partial'] },
    { key: 'roomType', label: 'Room Type', type: 'select', options: ['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor', 'Kids Room'] },
    { key: 'style', label: 'Style', type: 'text' },
    { key: 'careInstructions', label: 'Care Instructions', type: 'textarea' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  
  // Gifts
  'gifts': [
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'occasion', label: 'Occasion', type: 'select', options: ['Birthday', 'Anniversary', 'Wedding', 'Christmas', 'Valentine', 'Graduation', 'Any'], required: true },
    { key: 'recipient', label: 'Suitable For', type: 'select', options: ['Men', 'Women', 'Kids', 'Teens', 'Couples', 'Anyone'], required: true },
    { key: 'isPersonalizable', label: 'Personalizable', type: 'checkbox' },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'dimensions', label: 'Dimensions', type: 'text' },
    { key: 'giftWrapping', label: 'Gift Wrapping Available', type: 'checkbox' }
  ],
  
  // Electronics Subcategories
  'smartphones': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model', type: 'text', required: true },
    { key: 'processor', label: 'Processor/Chipset', type: 'text' },
    { key: 'ram', label: 'RAM', type: 'text' },
    { key: 'storage', label: 'Internal Storage', type: 'text' },
    { key: 'display', label: 'Display Size & Type', type: 'text' },
    { key: 'camera', label: 'Camera (Main/Front)', type: 'text' },
    { key: 'battery', label: 'Battery Capacity', type: 'text' },
    { key: 'os', label: 'Operating System', type: 'text' },
    { key: 'network', label: 'Network', type: 'select', options: ['5G', '4G LTE', '3G'] },
    { key: 'simType', label: 'SIM Type', type: 'select', options: ['Single SIM', 'Dual SIM', 'eSIM'] },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  'cameras': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model', type: 'text', required: true },
    { key: 'type', label: 'Camera Type', type: 'select', options: ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action Camera', 'Instant Camera'], required: true },
    { key: 'megapixels', label: 'Megapixels', type: 'text' },
    { key: 'sensor', label: 'Sensor Type & Size', type: 'text' },
    { key: 'videoResolution', label: 'Video Resolution', type: 'text' },
    { key: 'lens', label: 'Lens (Included)', type: 'text' },
    { key: 'iso', label: 'ISO Range', type: 'text' },
    { key: 'connectivity', label: 'Connectivity', type: 'text' },
    { key: 'battery', label: 'Battery Life', type: 'text' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  'gaming': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'type', label: 'Product Type', type: 'select', options: ['Console', 'Controller', 'Headset', 'Keyboard', 'Mouse', 'Chair', 'Accessory'], required: true },
    { key: 'platform', label: 'Platform/Compatibility', type: 'text' },
    { key: 'connectivity', label: 'Connectivity', type: 'select', options: ['Wired', 'Wireless', 'Bluetooth', 'Both'] },
    { key: 'features', label: 'Key Features', type: 'textarea' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  'wearables': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'type', label: 'Type', type: 'select', options: ['Fitness Tracker', 'Smart Band', 'Smart Ring', 'VR Headset', 'AR Glasses'], required: true },
    { key: 'display', label: 'Display', type: 'text' },
    { key: 'batteryLife', label: 'Battery Life', type: 'text' },
    { key: 'waterResistance', label: 'Water Resistance', type: 'text' },
    { key: 'compatibility', label: 'Compatible With', type: 'text' },
    { key: 'features', label: 'Health/Fitness Features', type: 'textarea' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  'audio': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'type', label: 'Type', type: 'select', options: ['Headphones', 'Earbuds', 'Speakers', 'Soundbar', 'Home Theater'], required: true },
    { key: 'connectivity', label: 'Connectivity', type: 'select', options: ['Wired', 'Bluetooth', 'Wi-Fi', 'Both'] },
    { key: 'batteryLife', label: 'Battery Life', type: 'text' },
    { key: 'noiseCancellation', label: 'Noise Cancellation', type: 'checkbox' },
    { key: 'waterResistance', label: 'Water Resistance', type: 'text' },
    { key: 'features', label: 'Features', type: 'textarea' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  'home-tech': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'type', label: 'Product Type', type: 'text', required: true },
    { key: 'connectivity', label: 'Connectivity', type: 'select', options: ['Wi-Fi', 'Bluetooth', 'Zigbee', 'Z-Wave', 'Thread'] },
    { key: 'compatibility', label: 'Smart Home Compatibility', type: 'text' },
    { key: 'powerSource', label: 'Power Source', type: 'text' },
    { key: 'features', label: 'Features', type: 'textarea' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  'networking': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'type', label: 'Type', type: 'select', options: ['Router', 'Modem', 'Switch', 'Access Point', 'Mesh System', 'Range Extender'], required: true },
    { key: 'speed', label: 'Speed/Standard', type: 'text' },
    { key: 'ports', label: 'Number of Ports', type: 'text' },
    { key: 'coverage', label: 'Coverage Area', type: 'text' },
    { key: 'features', label: 'Features', type: 'textarea' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  'smart-watches': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'display', label: 'Display Size & Type', type: 'text' },
    { key: 'batteryLife', label: 'Battery Life', type: 'text' },
    { key: 'waterResistance', label: 'Water Resistance', type: 'text' },
    { key: 'compatibility', label: 'Compatible With', type: 'text' },
    { key: 'healthFeatures', label: 'Health Features', type: 'textarea' },
    { key: 'connectivity', label: 'Connectivity', type: 'text' },
    { key: 'strapMaterial', label: 'Strap Material', type: 'text' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ],
  'storage': [
    { key: 'brand', label: 'Brand', type: 'text', required: true },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'type', label: 'Storage Type', type: 'select', options: ['External HDD', 'External SSD', 'Internal SSD', 'Internal HDD', 'USB Flash Drive', 'Memory Card', 'NAS'], required: true },
    { key: 'capacity', label: 'Storage Capacity', type: 'text', required: true },
    { key: 'interface', label: 'Interface', type: 'select', options: ['USB 3.0', 'USB 3.1', 'USB-C', 'Thunderbolt', 'SATA', 'NVMe'] },
    { key: 'speed', label: 'Read/Write Speed', type: 'text' },
    { key: 'formFactor', label: 'Form Factor', type: 'text' },
    { key: 'warranty', label: 'Warranty', type: 'text' }
  ]
};

// Consistent UI Components
const Card = ({ className = "", ...props }) => (
  <div className={["rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/40", className].join(" ")} {...props} />
);

const CardHeader = ({ className = "", ...props }) => (
  <div className={["px-5 pt-5", className].join(" ")} {...props} />
);

const CardTitle = ({ className = "", ...props }) => (
  <h3 className={["text-base font-semibold text-slate-800 dark:text-slate-100", className].join(" ")} {...props} />
);

const CardContent = ({ className = "", ...props }) => (
  <div className={["px-5 pb-5", className].join(" ")} {...props} />
);

const StatusPill = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Inactive: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
    Draft: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
  };
  const iconMap: Record<string, React.ReactNode> = {
    Active: <CheckCircle2 className="h-3.5 w-3.5" />,
    Inactive: <Clock8 className="h-3.5 w-3.5" />,
    Draft: <Clock8 className="h-3.5 w-3.5" />,
  };
  return (
    <span className={cls("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", map[status] || "")}>
      {iconMap[status] || null}
      {status}
    </span>
  );
};

// Product Card Component
const ProductCard = ({ product, onEdit, onDelete, onToggleStatus }: { 
  product: any; 
  onEdit: (product: any) => void; 
  onDelete: (id: string) => void; 
  onToggleStatus: (id: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <Image
            src={Array.isArray(product.images) ? product.images[0] : product.images}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl text-slate-300">📦</div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {product.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            product.stock > 10 ? 'bg-blue-100 text-blue-700' : 
            product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
          }`}>
            {product.stock} in stock
          </span>
        </div>
        
        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
            >
              <Button
                onClick={() => onEdit(product)}
                size="sm"
                className="bg-white text-slate-900 hover:bg-slate-100"
              >
                Edit
              </Button>
              <Button
                onClick={() => onToggleStatus(product.id)}
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {product.active ? 'Deactivate' : 'Activate'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">{product.title}</h3>
          <span className="text-lg font-bold text-blue-600">${(product.price / 100).toFixed(2)}</span>
        </div>
        
        <div className="text-xs text-slate-500 mb-2">SKU: {product.sku}</div>
        
        <div className="text-xs text-slate-600 line-clamp-2 mb-3">{product.description}</div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.categories?.slice(0, 2).map((cat: any) => (
            <span key={cat.id} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
              {cat.name}
            </span>
          ))}
          {product.categories?.length > 2 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
              +{product.categories.length - 2} more
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(product)}
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
          >
            Edit
          </Button>
          <Button
            onClick={() => onDelete(product.id)}
            size="sm"
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50 text-xs"
          >
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Product Form Modal
const ProductFormModal = ({ isOpen, onClose, product, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onSave: (productData: any) => void;
}) => {
  const [formData, setFormData] = useState({
    sku: '',
    title: '',
    slug: '',
    description: '',
    shortDesc: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    lowStockThreshold: '',
    active: true,
    images: [] as string[],
    categories: [] as string[],
    attributes: {} as Record<string, any>,
    tags: [] as string[],
    isNew: false,
    onSale: false,
    featured: false,
    freeShipping: true,
    estimatedDelivery: '3-5 Business Days',
    warranty: '',
    returnPolicy: '7-Day Returns',
    brand: '',
    weight: '',
    color: '',
    size: '',
    material: ''
  });
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (product) {
      const parseTags = (tags: any) => {
        if (Array.isArray(tags)) return tags;
        if (typeof tags === 'string') {
          try {
            return JSON.parse(tags);
          } catch {
            return [];
          }
        }
        return [];
      };

      const parseAttributes = (attrs: any) => {
        if (typeof attrs === 'string') {
          try {
            return JSON.parse(attrs);
          } catch {
            return {};
          }
        }
        return attrs || {};
      };

      setFormData({
        sku: product.sku || '',
        title: product.title || '',
        slug: product.slug || '',
        description: product.description || '',
        shortDesc: product.shortDesc || '',
        price: product.price ? (product.price / 100).toString() : '',
        compareAtPrice: product.compareAtPrice ? (product.compareAtPrice / 100).toString() : '',
        stock: product.stock?.toString() || '',
        lowStockThreshold: product.lowStockThreshold?.toString() || '',
        active: product.active ?? true,
        images: Array.isArray(product.images) ? product.images : [],
        categories: product.categories?.map((c: any) => c.id) || [],
        attributes: parseAttributes(product.attributes),
        tags: parseTags(product.tags),
        isNew: product.isNew || false,
        onSale: product.onSale || false,
        featured: product.featured || false,
        freeShipping: product.freeShipping ?? true,
        estimatedDelivery: product.estimatedDelivery || '3-5 Business Days',
        warranty: product.warranty || '',
        returnPolicy: product.returnPolicy || '7-Day Returns',
        brand: product.brand || '',
        weight: product.weight || '',
        color: product.color || '',
        size: product.size || '',
        material: product.material || ''
      });
    } else {
      setFormData({
        sku: '',
        title: '',
        slug: '',
        description: '',
        shortDesc: '',
        price: '',
        compareAtPrice: '',
        stock: '',
        lowStockThreshold: '',
        active: true,
        images: [],
        categories: [],
        attributes: {},
        tags: [],
        isNew: false,
        onSale: false,
        featured: false,
        freeShipping: true,
        estimatedDelivery: '3-5 Business Days',
        warranty: '',
        returnPolicy: '7-Day Returns',
        brand: '',
        weight: '',
        color: '',
        size: '',
        material: ''
      });
    }
    setCurrentStep(1);
  }, [product]);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);
    const uploadedImages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const response = await fetch('/api/admin/products/images', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          uploadedImages.push(data.url);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedImages]
    }));
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (saving) return; // Prevent double submission
    
    // Validation
    if (!formData.sku.trim()) {
      alert('Please enter a SKU');
      return;
    }
    if (!formData.title.trim()) {
      alert('Please enter a product title');
      return;
    }
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      alert('Please enter a valid price');
      return;
    }
    if (!formData.stock || isNaN(parseInt(formData.stock))) {
      alert('Please enter a valid stock quantity');
      return;
    }
    if (formData.images.length === 0) {
      alert('Please upload at least one product image');
      return;
    }
    if (formData.categories.length === 0) {
      alert('Please select at least one category');
      return;
    }

    // Validate category-specific required fields
    if (formData.categories.length > 0) {
      const selectedCategory = categories.find(c => formData.categories.includes(c.id));
      const template = selectedCategory ? CATEGORY_TEMPLATES[selectedCategory.slug] : null;
      
      if (template) {
        const missingFields: string[] = [];
        template.forEach(field => {
          if (field.required && !formData.attributes[field.key]) {
            missingFields.push(field.label);
          }
        });
        
        if (missingFields.length > 0) {
          alert(`Please fill in the following required fields:\n\n${missingFields.join('\n')}`);
          return;
        }
      }
    }

    setSaving(true);
    
    try {
      const productData = {
        ...formData,
        price: Math.round(parseFloat(formData.price) * 100), // Convert to cents
        compareAtPrice: formData.compareAtPrice ? Math.round(parseFloat(formData.compareAtPrice) * 100) : null,
        stock: parseInt(formData.stock),
        lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : null,
        weight: formData.weight || null,
      };
      console.log('Submitting product data:', productData);
      await onSave(productData);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setSaving(false);
    }
  };

  const nextStep = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };
  const prevStep = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-slate-600">Step {currentStep} of 3</p>
            </div>
            <Button onClick={onClose} variant="outline" size="sm" className="text-slate-500">
              ✕
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., IPH15P-256"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter product title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Describe your product..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
                <textarea
                  value={formData.shortDesc}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDesc: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Brief product summary (used in listings)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Compare At Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Original price (for showing discounts)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., Apple, Samsung"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., 1.5kg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., Black, Blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., M, L, XL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., Cotton, Aluminum, Plastic"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Inventory & Categories */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Inventory & Categories</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="auto-generated"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categories</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-slate-300 rounded-lg p-2">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, categories: [...prev.categories, cat.id] }));
                          } else {
                            setFormData(prev => ({ ...prev, categories: prev.categories.filter(id => id !== cat.id) }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-slate-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-slate-700">
                  Active Product
                </label>
              </div>

              {/* Category-Specific Attributes */}
              {formData.categories.length > 0 && (() => {
                const selectedCategory = categories.find(c => formData.categories.includes(c.id));
                const template = selectedCategory ? CATEGORY_TEMPLATES[selectedCategory.slug] : null;
                
                if (!template) return null;
                
                return (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-md font-semibold text-slate-900 mb-3">
                      {selectedCategory.name} Specific Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {template.map(field => (
                        <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {field.type === 'text' || field.type === 'number' || field.type === 'date' ? (
                            <input
                              type={field.type}
                              value={(formData.attributes && formData.attributes[field.key]) || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                attributes: { ...(prev.attributes || {}), [field.key]: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              required={field.required}
                            />
                          ) : field.type === 'textarea' ? (
                            <textarea
                              value={(formData.attributes && formData.attributes[field.key]) || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                attributes: { ...(prev.attributes || {}), [field.key]: e.target.value }
                              }))}
                              rows={3}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              required={field.required}
                            />
                          ) : field.type === 'select' ? (
                            <select
                              value={(formData.attributes && formData.attributes[field.key]) || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                attributes: { ...(prev.attributes || {}), [field.key]: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              required={field.required}
                            >
                              <option value="">Select...</option>
                              {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field.type === 'checkbox' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={(formData.attributes && formData.attributes[field.key]) === true}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  attributes: { ...(prev.attributes || {}), [field.key]: e.target.checked }
                                }))}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-slate-600">Yes</span>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Additional Product Settings */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-md font-semibold text-slate-900 mb-3">Product Settings & Badges</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Threshold</label>
                    <input
                      type="number"
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData(prev => ({ ...prev, lowStockThreshold: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g., 10"
                    />
                    <p className="text-xs text-slate-500 mt-1">Show "low stock" warning when stock falls below this number</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Delivery</label>
                    <input
                      type="text"
                      value={formData.estimatedDelivery}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g., 3-5 Business Days"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Warranty</label>
                    <input
                      type="text"
                      value={formData.warranty}
                      onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g., 1 Year Warranty"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Return Policy</label>
                    <input
                      type="text"
                      value={formData.returnPolicy}
                      onChange={(e) => setFormData(prev => ({ ...prev, returnPolicy: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g., 7-Day Returns"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Tags</label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Split by comma and trim each tag, but preserve spaces within tags
                      const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                      setFormData(prev => ({ ...prev, tags }));
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., Best Seller, Editor's Choice, Premium (comma-separated)"
                  />
                  <p className="text-xs text-slate-500 mt-1">Separate multiple tags with commas. Spaces within tags are allowed.</p>
                  {formData.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ 
                              ...prev, 
                              tags: prev.tags.filter((_, index) => index !== i) 
                            }))}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      id="isNew"
                      checked={formData.isNew}
                      onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                      className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="isNew" className="text-sm font-medium text-slate-700">
                      New Arrival
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      id="onSale"
                      checked={formData.onSale}
                      onChange={(e) => setFormData(prev => ({ ...prev, onSale: e.target.checked }))}
                      className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="onSale" className="text-sm font-medium text-slate-700">
                      On Sale
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                      Featured
                    </label>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      id="freeShipping"
                      checked={formData.freeShipping}
                      onChange={(e) => setFormData(prev => ({ ...prev, freeShipping: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="freeShipping" className="text-sm font-medium text-slate-700">
                      Free Shipping
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Images */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Images</h3>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
                >
                  <div className="text-3xl mb-2">📸</div>
                  <div className="font-medium text-slate-700 mb-1">
                    {uploading ? 'Uploading...' : 'Click to upload images'}
                  </div>
                  <div className="text-sm text-slate-500">PNG, JPG, GIF up to 10MB each</div>
                </label>
              </div>
              
              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        width={120}
                        height={120}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          
          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-slate-200 mt-6">
            <div>
              {currentStep > 1 && (
                <Button type="button" onClick={prevStep} variant="outline" size="sm">
                  ← Previous
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" onClick={onClose} variant="outline" size="sm">
                Cancel
              </Button>
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                  Next →
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={() => {
                    console.log('Create/Update button clicked');
                    handleSubmit();
                  }} 
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50" 
                  size="sm"
                >
                  {saving ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Filters Component
const ProductFilters = ({ filters, onFilterChange }: { 
  filters: any; 
  onFilterChange: (filters: any) => void;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Filters & Search</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search products..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Products</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Stock</label>
          <select
            value={filters.stock || ''}
            onChange={(e) => onFilterChange({ ...filters, stock: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
          <select
            value={filters.sortBy || ''}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Default</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
            <option value="created">Date Created</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Stats Component
const ProductStats = ({ stats }: { stats: any }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Total Products</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalProducts}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
            <Package className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Active Products</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">{stats.activeProducts}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Low Stock</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">{stats.lowStock}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-300">
            <Clock8 className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Out of Stock</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-red-600 dark:text-red-300">{stats.outOfStock}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-300">
            <Clock8 className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([
    {
      id: '1',
      sku: 'IPHONE-15-PRO',
      title: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Latest iPhone with advanced features',
      price: 125000,
      stock: 15,
      active: true,
      images: ['/images/iphone-15-pro.jpg'],
      categories: [{ id: '1', name: 'Smartphones' }]
    },
    {
      id: '2',
      sku: 'SAMSUNG-S24',
      title: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Premium Android smartphone',
      price: 85000,
      stock: 8,
      active: true,
      images: ['/images/samsung-s24.jpg'],
      categories: [{ id: '1', name: 'Smartphones' }]
    }
  ]);
  const [stats, setStats] = useState({
    totalProducts: 2,
    activeProducts: 2,
    lowStock: 1,
    outOfStock: 0
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    stock: '',
    sortBy: ''
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Handle both array and object responses
      const productsList = Array.isArray(data) ? data : (data.products || []);
      
      // Parse JSON fields if they're strings
      const parsedProducts = productsList.map((product: any) => ({
        ...product,
        images: typeof product.images === 'string' 
          ? (product.images ? JSON.parse(product.images) : [])
          : (product.images || []),
        attributes: typeof product.attributes === 'string'
          ? (product.attributes ? JSON.parse(product.attributes) : {})
          : (product.attributes || {}),
        tags: typeof product.tags === 'string'
          ? (product.tags ? JSON.parse(product.tags) : [])
          : (product.tags || [])
      }));
      
      setProducts(parsedProducts);
      
      // Calculate stats
      const totalProducts = parsedProducts.length;
      const activeProducts = parsedProducts.filter((p: any) => p.active).length;
      const lowStock = parsedProducts.filter((p: any) => p.stock > 0 && p.stock <= 10).length;
      const outOfStock = parsedProducts.filter((p: any) => p.stock === 0).length;
      
      setStats({ totalProducts, activeProducts, lowStock, outOfStock });
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data
      const mockProducts = [
        {
          id: '1',
          sku: 'IPH15P-256',
          title: 'iPhone 15 Pro 256GB',
          slug: 'iphone-15-pro-256gb',
          description: 'Latest iPhone with advanced camera system',
          price: 99900,
          stock: 12,
          active: true,
          images: ['/assets/products/phones/iphone-15-pro-1.jpg'],
          categories: [{ id: '1', name: 'Phones' }]
        },
        {
          id: '2',
          sku: 'MBA-M2-256',
          title: 'MacBook Air M2 256GB',
          slug: 'macbook-air-m2-256gb',
          description: 'Lightweight laptop with M2 chip',
          price: 129900,
          stock: 8,
          active: true,
          images: ['/assets/products/laptops/macbook-air-m2-1.jpg'],
          categories: [{ id: '2', name: 'Laptops' }]
        },
        {
          id: '3',
          sku: 'APP-2ND',
          title: 'AirPods Pro 2nd Gen',
          slug: 'airpods-pro-2nd-gen',
          description: 'Wireless earbuds with noise cancellation',
          price: 24900,
          stock: 0,
          active: false,
          images: ['/assets/products/accessories/airpods-pro-1.jpg'],
          categories: [{ id: '3', name: 'Accessories' }]
        }
      ];
      
      setProducts(mockProducts);
      setStats({
        totalProducts: mockProducts.length,
        activeProducts: mockProducts.filter(p => p.active).length,
        lowStock: mockProducts.filter(p => p.stock > 0 && p.stock <= 10).length,
        outOfStock: mockProducts.filter(p => p.stock === 0).length
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      console.log('handleSaveProduct called with:', productData);
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      console.log('Making request to:', url, 'with method:', method);
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Product saved successfully:', result);
        fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        alert(`Error saving product: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error saving product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const product = products.find(p => p.id === id);
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !product?.active })
      });
      
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const filteredProducts = products.filter(product => {
    if (filters.search && !product.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !product.sku.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status === 'active' && !product.active) return false;
    if (filters.status === 'inactive' && product.active) return false;
    if (filters.stock === 'in-stock' && product.stock <= 0) return false;
    if (filters.stock === 'low-stock' && (product.stock > 10 || product.stock <= 0)) return false;
    if (filters.stock === 'out-of-stock' && product.stock > 0) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Add Product Button */}
      <div className="flex justify-end items-center mb-6">
        <Button onClick={handleAddProduct} variant="primary" size="md">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

        {/* Stats */}
        <ProductStats stats={stats} />

        {/* Filters */}
        <ProductFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-600 mb-4">Get started by adding your first product</p>
            <Button onClick={handleAddProduct} variant="primary" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </div>
        )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </>
  );
}