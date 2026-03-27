import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Send, User, Calendar, CheckCircle2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Review, Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
    
    if (id) {
      const q = query(collection(db, 'reviews'), where('productId', '==', id));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reviewList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Review));
        setReviews(reviewList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      });
      return () => unsubscribe();
    }
  }, [id, products]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (!comment.trim()) return;

    setIsSubmitting(true);

    const newReview: Omit<Review, 'id'> = {
      productId: id!,
      userEmail: user.email,
      userName: user.username || user.email.split('@')[0],
      rating,
      comment,
      date: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'reviews'), newReview);
      setComment('');
      setRating(5);
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting review: ", error);
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900">Product not found</h2>
        <button 
          onClick={() => navigate('/shop')}
          className="mt-4 text-amber-700 font-bold hover:underline"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-bold text-sm group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        BACK TO COLLECTION
      </button>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square rounded-[3rem] overflow-hidden bg-stone-100 border border-stone-200 shadow-xl"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-8 left-8">
            <span className="px-6 py-2 bg-white/90 backdrop-blur-md text-xs font-bold uppercase tracking-widest rounded-full text-stone-900 border border-stone-100 shadow-sm">
              {product.category}
            </span>
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    fill={i < Math.floor(averageRating) ? "currentColor" : "none"} 
                    className={i < Math.floor(averageRating) ? "" : "text-stone-300"}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>
            <h1 className="text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-amber-800">Rs. {product.price.toLocaleString()}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Description</h3>
            <p className="text-lg text-stone-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 flex items-center justify-center gap-3 py-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/20 group"
            >
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              ADD TO CART
            </button>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-16 border-t border-stone-100">
        {/* Review Summary & Form */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-stone-900">Customer Reviews</h2>
            <div className="flex items-center gap-6 p-8 bg-stone-50 rounded-[2rem] border border-stone-100">
              <div className="text-center">
                <p className="text-5xl font-bold text-stone-900">{averageRating}</p>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Average</p>
              </div>
              <div className="h-12 w-px bg-stone-200" />
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < Math.floor(averageRating) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Based on {reviews.length} reviews</p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-stone-900">Write a Review</h3>
              <p className="text-sm text-stone-500">Share your experience with this product.</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 transition-all ${rating >= star ? 'text-amber-500 scale-110' : 'text-stone-200 hover:text-stone-300'}`}
                    >
                      <Star size={28} fill={rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Your Comment</label>
                <textarea
                  rows={4}
                  placeholder="What did you like or dislike?"
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all resize-none text-sm"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Star size={18} />
                  </motion.div>
                ) : (
                  <>
                    <Send size={18} />
                    POST REVIEW
                  </>
                )}
              </button>

              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-emerald-600 justify-center font-bold text-xs"
                  >
                    <CheckCircle2 size={16} />
                    REVIEW POSTED SUCCESSFULLY!
                  </motion.div>
                )}
              </AnimatePresence>

              {!isAuthenticated && (
                <p className="text-[10px] text-center text-stone-400 font-bold uppercase tracking-widest">
                  Please <button type="button" onClick={() => navigate('/login')} className="text-amber-700 hover:underline">login</button> to post a review
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Review List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-stone-900">Recent Reviews</h3>
            <div className="h-px flex-grow mx-8 bg-stone-100 hidden sm:block" />
          </div>

          {reviews.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-stone-50 rounded-[3rem] border border-dashed border-stone-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-stone-200">
                <Star size={24} />
              </div>
              <p className="text-stone-500 font-medium italic">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">{review.userName}</p>
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                          <Calendar size={12} />
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < review.rating ? "currentColor" : "none"}
                          className={i < review.rating ? "" : "text-stone-200"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-700 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
