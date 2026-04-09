import Container from "./primitives/Container";
import Surface from "./primitives/Surface";
import SectionHeading from "./primitives/SectionHeading";

function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Tech Enthusiast",
      content:
        "RetroElectro helped me find a perfect laptop for my design work with just a simple description of what I needed. The recommendations were spot on!",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      id: 2,
      name: "David Chen",
      role: "Software Developer",
      content:
        "I was skeptical about the natural language search, but it actually worked! Found a high-performance laptop with great battery life within my budget.",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      role: "Professional Photographer",
      content:
        "The site recommended me a camera that perfectly matched my requirements. Saved me hours of research and comparison across multiple websites.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

  return (
    <section className="py-10">
      <Container>
        <Surface className="rounded-re-xl px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Testimonials"
              title="What users say"
              subtitle="A few quick stories from people who found the right device faster."
            />

            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="relative rounded-re-xl border border-re-border0 bg-white/4 p-6 re-raise"
                >
                  <div className="absolute right-5 top-5 text-white/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275zm-13 0c0-5.141 3.892-10.519 10-11.725l.984 2.126c-2.215.835-4.163 3.742-4.38 5.746 2.491.392 4.396 2.547 4.396 5.149 0 3.182-2.584 4.979-5.199 4.979-3.015 0-5.801-2.305-5.801-6.275z" />
                    </svg>
                  </div>

                  <p className="text-sm leading-relaxed text-re-text1">
                    “{testimonial.content}”
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full border border-re-border0 object-cover"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-re-text0">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-re-text2">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Surface>
      </Container>
    </section>
  );
}

export default TestimonialSection;