import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';

const Shop = () => {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, searchQuery, sortBy, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="relative p-12 rounded-[3rem] overflow-hidden bg-stone-900 text-white mb-16">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/leather.png")',
            backgroundRepeat: 'repeat'
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">EXPLORE COLLECTION</span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
              OUR <span className="italic font-light text-stone-400">SHOP</span>
            </h1>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for chappals..." 
              className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm text-white placeholder:text-white/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-y border-stone-100">
        <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat 
                ? 'bg-stone-900 text-white shadow-lg' 
                : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-900 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <select 
              className="appearance-none w-full md:w-48 pl-6 pr-12 py-3 bg-white border border-stone-200 rounded-full text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-700/20 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-32 space-y-6 bg-stone-50 rounded-[3rem] border border-dashed border-stone-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-stone-200 shadow-sm">
            <Filter size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold text-stone-900">No products available</h3>
            <p className="text-stone-700 max-w-md mx-auto">We are currently updating our collection. Please check back soon for our latest handcrafted designs!</p>
          </div>
        </div>
      )}

      {products.length > 0 && filteredProducts.length === 0 && (
        <div className="text-center py-24 space-y-6">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <Search size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold text-stone-900">No products found</h3>
            <p className="text-stone-700">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSortBy('popular'); }}
            className="px-8 py-3 bg-stone-900 text-white font-bold rounded-full hover:bg-stone-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;
