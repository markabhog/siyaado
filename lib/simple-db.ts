// Simple database fallback when Prisma is not working
export const mockProducts = [
  {
    id: "1",
    slug: "smartphone-x",
    title: "Smartphone X Pro",
    description: "Latest smartphone with advanced features",
    price: 59999, // in cents
    stock: 10,
    images: ["/assets/products/phones/smartphone-x-1.jpg"],
    categories: [{ id: "1", name: "Phones", slug: "phones" }],
    rating: 4.5,
    reviewsCount: 128,
    highlights: [
      "6.1-inch Super Retina XDR display",
      "A15 Bionic chip with 6-core CPU",
      "Advanced camera system",
      "All-day battery life"
    ],
    bullets: [
      "6.1-inch Super Retina XDR display",
      "A15 Bionic chip with 6-core CPU",
      "Advanced camera system",
      "All-day battery life"
    ],
    specifications: {
      "Display": "6.1-inch Super Retina XDR",
      "Chip": "A15 Bionic",
      "Camera": "12MP Ultra Wide, Wide cameras",
      "Battery": "Up to 17 hours video playback"
    },
    reviews: [
      {
        id: "1",
        author: "John D.",
        rating: 5,
        comment: "Amazing phone! Great camera quality.",
        date: "2024-01-15"
      }
    ],
    mrp: 69999,
    createdAt: new Date()
  },
  {
    id: "2",
    slug: "laptop-ultrabook",
    title: "Ultrabook 13 Pro",
    description: "Lightweight laptop for professionals",
    price: 129999,
    stock: 5,
    images: ["/assets/products/laptops/ultrabook-13-1.jpg"],
    categories: [{ id: "2", name: "Laptops", slug: "laptops" }],
    rating: 4.8,
    reviewsCount: 89,
    highlights: [
      "13-inch Retina display",
      "M2 chip with 8-core CPU",
      "Up to 18 hours battery life",
      "Lightweight design"
    ],
    bullets: [
      "13-inch Retina display",
      "M2 chip with 8-core CPU", 
      "Up to 18 hours battery life",
      "Lightweight design"
    ],
    specifications: {
      "Display": "13-inch Retina",
      "Chip": "M2",
      "Storage": "256GB SSD",
      "Battery": "Up to 18 hours"
    },
    reviews: [
      {
        id: "2",
        author: "Sarah M.",
        rating: 5,
        comment: "Perfect for work and travel!",
        date: "2024-01-10"
      }
    ],
    mrp: 149999,
    createdAt: new Date()
  },
  {
    id: "3",
    slug: "classic-watch",
    title: "Classic Watch",
    description: "Timeless watch for any occasion",
    price: 29999,
    stock: 15,
    images: ["/assets/products/watches/classic-watch-1.jpg"],
    categories: [{ id: "3", name: "Watches", slug: "watches" }],
    rating: 4.3,
    reviewsCount: 67,
    highlights: [
      "Stainless steel case",
      "Leather strap",
      "Water resistant",
      "Quartz movement"
    ],
    bullets: [
      "Stainless steel case",
      "Leather strap",
      "Water resistant",
      "Quartz movement"
    ],
    specifications: {
      "Case": "Stainless steel",
      "Strap": "Genuine leather",
      "Water Resistance": "50m",
      "Movement": "Quartz"
    },
    reviews: [
      {
        id: "3",
        author: "Mike R.",
        rating: 4,
        comment: "Great watch for the price!",
        date: "2024-01-05"
      }
    ],
    mrp: 39999,
    createdAt: new Date()
  },
  {
    id: "4",
    slug: "baby-diapers-m",
    title: "Baby Diapers M Size",
    description: "Comfortable and absorbent baby diapers",
    price: 1999,
    stock: 20,
    images: ["/assets/products/p2.png"],
    categories: [{ id: "4", name: "Baby Care", slug: "baby-care" }],
    rating: 4.2,
    reviewsCount: 45,
    highlights: [
      "Super absorbent",
      "Comfortable fit",
      "Hypoallergenic",
      "Easy to use"
    ],
    bullets: [
      "Super absorbent",
      "Comfortable fit", 
      "Hypoallergenic",
      "Easy to use"
    ],
    specifications: {
      "Size": "Medium",
      "Absorbency": "High",
      "Material": "Hypoallergenic",
      "Pack": "50 pieces"
    },
    reviews: [
      {
        id: "4",
        author: "Parent",
        rating: 4,
        comment: "Great for my baby!",
        date: "2024-01-12"
      }
    ],
    mrp: 2499,
    createdAt: new Date()
  },
  {
    id: "5",
    slug: "ultrabook-13",
    title: "Ultrabook 13 Pro",
    description: "Lightweight laptop for professionals",
    price: 129999,
    stock: 5,
    images: ["/assets/products/laptops/ultrabook-13-1.jpg"],
    categories: [{ id: "2", name: "Laptops", slug: "laptops" }],
    rating: 4.8,
    reviewsCount: 89,
    highlights: [
      "13-inch Retina display",
      "M2 chip with 8-core CPU",
      "Up to 18 hours battery life",
      "Lightweight design"
    ],
    bullets: [
      "13-inch Retina display",
      "M2 chip with 8-core CPU", 
      "Up to 18 hours battery life",
      "Lightweight design"
    ],
    specifications: {
      "Display": "13-inch Retina",
      "Chip": "M2",
      "Storage": "256GB SSD",
      "Battery": "Up to 18 hours"
    },
    reviews: [
      {
        id: "5",
        author: "Sarah M.",
        rating: 5,
        comment: "Perfect for work and travel!",
        date: "2024-01-10"
      }
    ],
    mrp: 149999,
    createdAt: new Date()
  },
  {
    id: "6",
    slug: "book-3",
    title: "Programming Fundamentals",
    description: "Comprehensive guide to programming",
    price: 2999,
    stock: 15,
    images: ["/assets/books/3.jpg"],
    categories: [{ id: "5", name: "Books", slug: "books" }],
    rating: 4.6,
    reviewsCount: 78,
    highlights: [
      "Comprehensive coverage",
      "Beginner friendly",
      "Practical examples",
      "Updated content"
    ],
    bullets: [
      "Comprehensive coverage",
      "Beginner friendly",
      "Practical examples", 
      "Updated content"
    ],
    specifications: {
      "Pages": "400+",
      "Language": "English",
      "Format": "Paperback",
      "Publisher": "Tech Books"
    },
    reviews: [
      {
        id: "6",
        author: "Student",
        rating: 5,
        comment: "Great learning resource!",
        date: "2024-01-08"
      }
    ],
    mrp: 3999,
    createdAt: new Date()
  }
];

export const mockCategories = [
  {
    id: "1",
    name: "Phones",
    slug: "phones",
    products: mockProducts.filter(p => p.categories[0].name === "Phones")
  },
  {
    id: "2", 
    name: "Laptops",
    slug: "laptops",
    products: mockProducts.filter(p => p.categories[0].name === "Laptops")
  },
  {
    id: "3",
    name: "Watches", 
    slug: "watches",
    products: mockProducts.filter(p => p.categories[0].name === "Watches")
  },
  {
    id: "4",
    name: "Baby Care",
    slug: "baby-care",
    products: mockProducts.filter(p => p.categories[0].name === "Baby Care")
  },
  {
    id: "5",
    name: "Books",
    slug: "books", 
    products: mockProducts.filter(p => p.categories[0].name === "Books")
  }
];
