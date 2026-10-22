import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Upload PDF",
    description: "Add your book file",
  },
  {
    number: 2,
    title: "AI Processing",
    description: "We analyze the content",
  },
  {
    number: 3,
    title: "Voice Chat",
    description: "Discuss with AI",
  },
];

const HeroSection = () => {
  return (
      <section className="wrapper mb-10 md:mb-16">
        <div className="library-hero-card">
          <div className="library-hero-content">
            {/* Left Section */}
            <div className="library-hero-text">
              <h1 className="library-hero-title">Your Library</h1>
              <p className="library-hero-description">
                Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.
              </p>
              <Link href="/books/new" className="library-cta-primary">
                <Plus className="w-5 h-5 text-[var(--text-primary)]" />
                <span>Add new book</span>
              </Link>
            </div>

            {/* Center Illustration - Desktop */}
            <div className="library-hero-illustration-desktop">
              <Image
                  src="/assets/hero-illustration.png"
                  alt="Vintage books, globe, and lamp illustration"
                  width={430}
                  height={308}
                  className="object-contain"
                  priority
              />
            </div>

            {/* Center Illustration - Mobile */}
            <div className="library-hero-illustration">
              <Image
                  src="/assets/hero-illustration.png"
                  alt="Vintage books, globe, and lamp illustration"
                  width={320}
                  height={230}
                  className="object-contain"
              />
            </div>

            {/* Right Section - Steps Card */}
            <div className="library-steps-card p-5 md:p-6 rounded-[12px] space-y-4 md:space-y-5 min-w-[230px] lg:min-w-[250px] shadow-sm">
              {steps.map((step) => (
                  <div key={step.number} className="library-step-item">
                    <div className="library-step-number">{step.number}</div>
                    <div>
                      <h3 className="library-step-title">{step.title}</h3>
                      <p className="library-step-description">{step.description}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>


        </div>
      </section>

  );
};

export default HeroSection;
