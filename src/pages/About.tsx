import React from 'react';
import { motion } from 'motion/react';
import { Award, Users, History, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/api/attachments/1742381294827_chappal.jpg" 
            alt="About Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        </div>
        <div className="relative z-10 text-center text-white space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight">Our Heritage</h1>
          <p className="text-xl font-light opacity-80">A legacy of craftsmanship since 1995</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16">
        <div className="space-y-8 text-center">
          <h2 className="text-4xl font-serif font-bold text-stone-900">The Art of Peshawari Craft</h2>
          <p className="text-lg text-stone-700 leading-relaxed">
            Peshawari Chappal House was born out of a passion for preserving the rich cultural heritage of Pakistan. For over three decades, we have been dedicated to the art of traditional footwear, combining age-old techniques with modern comfort.
          </p>
          <p className="text-lg text-stone-700 leading-relaxed">
            Every pair of chappals we create is a masterpiece, handcrafted by master artisans who have inherited their skills through generations. We use only the finest top-grain leathers and traditional stitching methods to ensure that every step you take is a testament to quality and style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-sm space-y-6">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
              <History size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">Our History</h3>
            <p className="text-stone-700 leading-relaxed">
              Starting as a small workshop in the heart of Peshawar, we have grown into a premier destination for authentic footwear, serving customers across the globe while staying true to our roots.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-sm space-y-6">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">Our Community</h3>
            <p className="text-stone-700 leading-relaxed">
              We support a community of over 50 master artisans, providing them with fair wages and a platform to showcase their incredible talent to the world.
            </p>
          </div>
        </div>

        <div className="pt-16 space-y-12">
          <h2 className="text-3xl font-serif font-bold text-stone-900 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              "100% Genuine Top-Grain Leather",
              "Traditional Hand-Stitching Techniques",
              "Double Sole for Enhanced Comfort",
              "Custom Sizing for the Perfect Fit",
              "Global Shipping with Secure Tracking",
              "Legacy of Trust and Quality"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <CheckCircle size={20} className="text-amber-700 flex-shrink-0" />
                <span className="font-medium text-stone-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
