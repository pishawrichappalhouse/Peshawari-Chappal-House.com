import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, RefreshCw, Quote, Send } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';

const Home = () => {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/api/attachments/1742381294827_chappal.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-amber-500 font-bold uppercase tracking-[0.4em] text-xs md:text-sm">LEGACY OF CRAFTSMANSHIP</span>
            <h1 className="text-6xl md:text-9xl font-serif font-bold tracking-tighter leading-[0.9]">
              PESHAWARI <br /> <span className="italic text-amber-500">CHAPPAL</span> HOUSE
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-2xl opacity-80 font-light leading-relaxed">
              Experience the timeless elegance and unparalleled comfort of our authentic handcrafted black Peshawari footwear. A legacy of craftsmanship in every step.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              to="/shop" 
              className="px-12 py-6 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-full transition-all duration-300 flex items-center gap-3 group shadow-2xl shadow-amber-900/40"
            >
              SHOP NOW
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/about" 
              className="px-12 py-6 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 font-bold rounded-full transition-all duration-300"
            >
              OUR STORY
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hidden md:block">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Classic", img: "https://image2url.com/r2/default/images/1773957794146-12b32bf4-bbe9-4431-a73a-21d3d8943b8e.png", count: "12 Designs" },
            { title: "Premium", img: "https://www.peshawarichappals.pk/cdn/shop/collections/20251017_2014_image.png?v=1762248469", count: "8 Designs" },
            { title: "Modern", img: "https://www.peshawarichappals.pk/cdn/shop/files/7-15-700x700.jpg?v=1763232686&width=750", count: "15 Designs" }
          ].map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group h-96 rounded-[2rem] overflow-hidden cursor-pointer"
            >
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                <p className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-2">{cat.count}</p>
                <h3 className="text-3xl font-serif font-bold text-white">{cat.title} Collection</h3>
                <Link to="/shop" className="mt-4 text-white/70 text-sm font-bold flex items-center gap-2 group-hover:text-white transition-colors">
                  EXPLORE <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-stone-50 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: <Shield size={32} />, title: "Premium Leather", desc: "100% genuine top-grain leather sourced locally." },
              { icon: <Star size={32} />, title: "Handcrafted", desc: "Each pair is meticulously stitched by master artisans." },
              { icon: <Truck size={32} />, title: "Express Shipping", desc: "Fast and secure delivery to your doorstep nationwide." },
              { icon: <RefreshCw size={32} />, title: "Easy Returns", desc: "Hassle-free 15-day return and exchange policy." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl">
                  {feature.icon}
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900">{feature.title}</h3>
                <p className="text-sm text-stone-700 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <span className="text-amber-700 font-bold uppercase tracking-widest text-xs">CURATED SELECTION</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 tracking-tight">
              FEATURED <span className="italic font-light text-stone-600">DESIGNS</span>
            </h2>
          </div>
          <Link to="/shop" className="text-stone-900 font-bold flex items-center gap-2 hover:text-amber-700 transition-colors group">
            VIEW ALL PRODUCTS
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* About Summary Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <span className="text-amber-700 font-bold uppercase tracking-widest text-xs">OUR HERITAGE</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">
              CRAFTING LEGENDS <br /> <span className="italic font-light text-stone-600">SINCE 1995</span>
            </h2>
            <p className="text-stone-700 text-lg leading-relaxed">
              At Peshawari Chappal House, we don't just make shoes; we preserve a culture. Every stitch is a testament to the master artisans who have passed down their skills through generations. 
            </p>
            <p className="text-stone-700 text-lg leading-relaxed">
              Our commitment to quality starts with the finest leather and ends with a product that stands the test of time, both in durability and style.
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 text-stone-900 font-bold border-b-2 border-amber-700 pb-1 hover:text-amber-700 transition-colors"
            >
              LEARN MORE ABOUT US <ArrowRight size={18} />
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden">
              <img 
                src="https://www.peshawarichappals.pk/cdn/shop/files/peshawari_chappal_092144.jpg?v=1757613283&width=750" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[2rem] shadow-2xl hidden md:block">
              <p className="text-4xl font-serif font-bold text-stone-900">30+</p>
              <p className="text-stone-500 text-sm font-bold uppercase tracking-widest">Years of Excellence</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-stone-900 py-32 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="text-center space-y-4">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">VOICES OF OUR CLIENTS</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
              TRUSTED BY <span className="italic font-light text-stone-400">THOUSANDS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Ahmed Khan", role: "Business Owner", text: "The quality of leather is exceptional. I've been wearing their chappals for 5 years and they still look new." },
              { name: "Sara Malik", role: "Fashion Designer", text: "A perfect blend of traditional design and modern comfort. These are my go-to shoes for every formal event." },
              { name: "Zubair Shah", role: "Collector", text: "The attention to detail in the stitching is something you rarely find these days. Truly a masterpiece." }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="space-y-6 p-10 rounded-[2rem] bg-white/5 border border-white/10"
              >
                <Quote className="text-amber-500" size={40} />
                <p className="text-lg text-stone-300 italic leading-relaxed">"{t.text}"</p>
                <div className="pt-6 border-t border-white/10">
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-stone-500 text-xs uppercase tracking-widest font-bold">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[4rem] overflow-hidden bg-amber-800 py-24 px-8 md:px-24 text-center space-y-10">
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ 
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/leather.png")',
              backgroundRepeat: 'repeat'
            }}
          />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
              JOIN THE <span className="italic font-light">ELITE CIRCLE</span>
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-light">
              Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and heritage stories.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 mt-10">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow px-8 py-5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all"
              />
              <button className="px-10 py-5 bg-white text-amber-700 font-bold rounded-full hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 group">
                SUBSCRIBE <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

