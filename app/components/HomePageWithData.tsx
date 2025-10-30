import { HomepageLogic } from "@/lib/homepage-logic";
import { mockProducts, mockCategories } from "@/lib/simple-db";
import FullPage from "./FullPage";

export default async function HomePageWithData() {
  try {
    // Get dynamic homepage data based on e-commerce logic
    const homepageData = await HomepageLogic.getHomepageData();
    return <FullPage homepageData={homepageData} />;
  } catch (error) {
    console.error('Database connection error:', error);
    
    // Use mock data when database is not available
    const fallbackData = {
      featuredProducts: mockProducts.slice(0, 4),
      onSaleProducts: mockProducts.slice(1, 5),
      topRatedProducts: mockProducts.slice(0, 3),
      categoryShowcase: mockCategories,
      laptopDeals: mockProducts.filter(p => p.categories[0].name === "Laptops"),
      bookCarousel: mockProducts.slice(0, 6),
      specialOffer: {
        id: "special-1",
        title: "Gaming Controller",
        description: "Premium gaming controller",
        price: 4999,
        images: ["/assets/offer/controller.jpg"],
        discount: 20
      },
      heroBanner: {
        title: "Welcome to Luul",
        subtitle: "Your premium shopping destination",
        image: "/assets/hero/watch.jpg"
      },
      featuredImages: [
        "/assets/products/p1.png", "/assets/products/p2.png", "/assets/products/p3.png", "/assets/products/p4.png",
        "/assets/products/p5.png", "/assets/products/p6.png", "/assets/products/p7.png", "/assets/products/p8.png"
      ],
      onSaleImages: [
        "/assets/products/p1.png", "/assets/products/p2.png", "/assets/products/p3.png", "/assets/products/p4.png"
      ],
      topRatedImages: [
        "/assets/products/p5.png", "/assets/products/p6.png", "/assets/products/p7.png", "/assets/products/p8.png"
      ],
      laptopImages: [
        "/assets/laptops/mbp.jpg", "/assets/laptops/xps.jpg", "/assets/laptops/spectre.jpg", "/assets/laptops/x1.jpg"
      ],
      bookImages: [
        "/assets/books/1.jpg", "/assets/books/2.jpg", "/assets/books/3.jpg",
        "/assets/books/4.jpg", "/assets/books/5.jpg", "/assets/books/6.jpg"
      ]
    };
    
    return <FullPage homepageData={fallbackData} />;
  }
}
