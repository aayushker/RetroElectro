function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Tech Enthusiast',
      content: 'RetroElectro helped me find a perfect laptop for my design work with just a simple description of what I needed. The recommendations were spot on!',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    {
      id: 2,
      name: 'David Chen',
      role: 'Software Developer',
      content: 'I was skeptical about the natural language search, but it actually worked! Found a high-performance laptop with great battery life within my budget.',
      image: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Professional Photographer',
      content: 'The site recommended me a camera that perfectly matched my requirements. Saved me hours of research and comparison across multiple websites.',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how we've helped people find their perfect electronic devices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z" />
                </svg>
              </div>

              <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>

              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium underline">
            Read more testimonials →
          </a>
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection; 