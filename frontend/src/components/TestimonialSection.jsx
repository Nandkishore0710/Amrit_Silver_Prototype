import React from 'react';

const testimonials = [
  {
    text: "quality of covers are very good, the price is also genuine. the handcrafted work is nice and superb. comparative a very good website! definitely go for it they are best.",
    author: "ankit mishra"
  },
  {
    text: "I absolutely love this shop! The products are high-quality and the customer service is excellent. I always leave with exactly what I need and a smile on my face.",
    author: "jaya sharma"
  },
  {
    text: "I love this store! Top-quality silver covers and super friendly interface. bought silver covers from this website several times, absolutely recommended.",
    author: "raj sahu"
  },
  {
    text: "Fantastic shop! Great selection, fair prices, and friendly staff. Highly recommended. The quality of the products is exceptional, and the prices are very reasonable!",
    author: "divya shah"
  }
];

const TestimonialSection = () => {
  return (
    <section className="bg-stone-50 py-16 my-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-light text-center mb-12 text-stone-800">
          What People <span className="font-semibold text-amber-600">Are Saying</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-amber-600">
              <p className="text-stone-600 text-sm italic mb-3">"{item.text}"</p>
              <p className="font-medium text-stone-800">— {item.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
