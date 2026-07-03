import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - AMRIT SILVER</title>
        <meta name="description" content="Learn about Amrit Silver's legacy of crafting premium 92.5 sterling silver phone covers." />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=1920&auto=format&fit=crop)' }}
        ></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white font-serif mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Our Legacy
          </h1>
          <p className="text-lg md:text-xl text-gray-200 tracking-wider uppercase">Crafting Prestige Since 1995</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1000px]">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1F1F1F] mb-6">The Amrit Silver Story</h2>
            <div className="w-16 h-1 bg-[#c8a97e] mx-auto mb-8"></div>
            <p className="text-[#696C70] text-lg leading-relaxed mb-6">
              Amrit Silver was born from a simple yet profound vision: to merge the timeless art of traditional silversmithing with the modern necessity of technology. We believe that your phone, the device you carry everywhere, deserves to be wrapped in something extraordinary.
            </p>
            <p className="text-[#696C70] text-lg leading-relaxed">
              Every single Amrit Silver cover is meticulously handcrafted by master artisans using 92.5% pure sterling silver. We don't just stamp metal; we sculpt stories, weave heritage into every curve, and polish prestige into every edge.
            </p>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=800&auto=format&fit=crop" 
                alt="Silver Craftsmanship" 
                className="w-full rounded-lg shadow-xl"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-[#1F1F1F] mb-6">Uncompromising Quality</h2>
              <p className="text-[#696C70] text-lg leading-relaxed mb-6">
                Mass production has no place at Amrit Silver. The journey of each phone cover begins with the highest grade sterling silver, ethically sourced and painstakingly purified. Our artisans use techniques passed down through generations to emboss intricate details—from divine deities to royal Rajputana motifs—ensuring that no two covers are exactly alike.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#c8a97e] rounded-full"></div>
                  <span className="text-[#1F1F1F] font-bold">100% Authentic 92.5 Sterling Silver</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#c8a97e] rounded-full"></div>
                  <span className="text-[#1F1F1F] font-bold">Hand-embossed by Master Craftsmen</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#c8a97e] rounded-full"></div>
                  <span className="text-[#1F1F1F] font-bold">Tarnish-resistant Protective Coating</span>
                </li>
              </ul>
              <Link to="/products" className="inline-block bg-black text-white px-8 py-4 rounded font-bold uppercase tracking-wider hover:bg-[#c8a97e] transition-colors">
                Explore the Collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
