"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/app/components/ui';
import { 
  Store, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Shield, 
  Truck, 
  BarChart3, 
  CheckCircle, 
  Star, 
  ArrowRight,
  Globe,
  Smartphone,
  Laptop,
  Headphones,
  Camera,
  Watch,
  Zap,
  Target,
  Award,
  Heart,
  ShoppingBag,
  MessageCircle,
  Clock,
  MapPin,
  BookOpen
} from 'lucide-react';

const features = [
  {
    icon: <Store className="h-8 w-8" />,
    title: "Your Own Store",
    description: "Create a beautiful storefront that represents your brand"
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Growth Analytics",
    description: "Track sales, customers, and performance with detailed insights"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Secure Payments",
    description: "Get paid securely with our integrated payment system"
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: "Fulfillment Support",
    description: "We handle shipping, returns, and customer service"
  }
];

const stats = [
  { number: "10K+", label: "Active Vendors", icon: <Users className="h-6 w-6" /> },
  { number: "$2M+", label: "Monthly Sales", icon: <DollarSign className="h-6 w-6" /> },
  { number: "95%", label: "Vendor Satisfaction", icon: <Star className="h-6 w-6" /> },
  { number: "24/7", label: "Support", icon: <MessageCircle className="h-6 w-6" /> }
];

const categories = [
  { name: "Electronics", icon: <Smartphone className="h-6 w-6" />, color: "bg-blue-500" },
  { name: "Fashion", icon: <Heart className="h-6 w-6" />, color: "bg-pink-500" },
  { name: "Home & Garden", icon: <Globe className="h-6 w-6" />, color: "bg-green-500" },
  { name: "Sports", icon: <Target className="h-6 w-6" />, color: "bg-orange-500" },
  { name: "Beauty", icon: <Award className="h-6 w-6" />, color: "bg-purple-500" },
  { name: "Books", icon: <BookOpen className="h-6 w-6" />, color: "bg-indigo-500" }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    business: "TechGear Store",
    avatar: "👩‍💼",
    content: "Luul has transformed my business. Sales increased by 300% in just 6 months!",
    rating: 5
  },
  {
    name: "Mike Chen",
    business: "Fashion Forward",
    avatar: "👨‍💻",
    content: "The analytics dashboard helps me understand my customers better than ever.",
    rating: 5
  },
  {
    name: "Emma Davis",
    business: "Home Decor Plus",
    avatar: "👩‍🎨",
    content: "Customer support is amazing. They helped me set up my store in minutes.",
    rating: 5
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for new sellers - No fees!",
    features: [
      "Unlimited products",
      "Basic analytics",
      "Standard support",
      "Mobile app access",
      "No monthly fees",
      "No setup costs"
    ],
    popular: true
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For growing businesses",
    features: [
      "Everything in Free",
      "Advanced analytics",
      "Priority support",
      "Custom store design",
      "Marketing tools"
    ],
    popular: false
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For established businesses",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "White-label options"
    ],
    popular: false
  }
];

export default function ResellerPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                Join 10,000+ successful sellers
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Start Selling on{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Luul
                </span>
              </h1>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <CheckCircle className="h-4 w-4" />
                100% FREE to start selling
              </div>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Build your business, reach millions of customers, and grow your revenue with our powerful marketplace platform. No setup fees, no monthly costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/reseller/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                    Start Selling Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Your Store Dashboard</h3>
                    <p className="text-sm text-slate-500">Real-time insights</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-600">Today's Sales</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">$2,847</p>
                    <p className="text-xs text-green-600">+12% from yesterday</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-600">New Customers</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">47</p>
                    <p className="text-xs text-blue-600">+8% from yesterday</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Orders pending</span>
                    <span className="text-sm font-semibold text-slate-900">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Products live</span>
                    <span className="text-sm font-semibold text-slate-900">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">This month's revenue</span>
                    <span className="text-sm font-semibold text-green-600">$12,847</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
                <div className="text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful tools and features designed to help you grow your business and reach more customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Sell in any category
            </h2>
            <p className="text-xl text-slate-600">
              From electronics to fashion, find your niche and start selling
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${category.color} text-white rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-slate-900">{category.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Loved by thousands of sellers
            </h2>
            <p className="text-xl text-slate-600">
              See what our community has to say about selling on Luul
            </p>
          </div>

          <div className="relative">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{testimonials[activeTestimonial].avatar}</div>
                <div>
                  <h4 className="text-xl font-semibold text-slate-900">{testimonials[activeTestimonial].name}</h4>
                  <p className="text-slate-600">{testimonials[activeTestimonial].business}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-lg text-slate-700 italic">
                "{testimonials[activeTestimonial].content}"
              </blockquote>
            </motion.div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-slate-600">
              Choose the plan that's right for your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white rounded-3xl p-8 relative ${
                  plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : 'shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-600">{plan.period}</span>}
                  </div>
                  <p className="text-slate-600 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                  size="lg"
                >
                  {plan.name === 'Starter' ? 'Get Started' : 'Choose Plan'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to start selling?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful sellers and start your journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reseller/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                Start Your Store
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
