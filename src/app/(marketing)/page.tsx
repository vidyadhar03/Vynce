'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function MarketingHomePage() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [demoVisible, setDemoVisible] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4" id="hero">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                See the story your music & Insta are telling
              </h1>
              <p className="text-lg text-gray-600">
                Turn your Spotify history and Instagram activity into playful, shareable insight cards
              </p>
              <Link 
                href="/sign-up" 
                className="inline-block px-8 py-4 bg-[#4C7EFF] text-white rounded-full text-lg hover:bg-blue-600 transition-transform hover:scale-105"
              >
                Get my free insight
              </Link>
            </div>
            <div className="relative h-80 bg-white rounded-2xl shadow-lg p-6 transform hover:rotate-1 transition-transform duration-500">
              {/* Mock insight card */}
              <div className="h-full flex items-center justify-center text-gray-400">
                Sample Insight Card
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why it feels magical */}
      <section className="py-20 px-4 bg-white" id="features">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why it feels magical</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Mood Mirror',
                description: 'See how your music reflects your emotional journey'
              },
              {
                title: 'Attention Tracker',
                description: 'Discover what captures your interest on Instagram'
              },
              {
                title: 'Friend-Share Cards',
                description: 'Create beautiful cards to share your insights'
              }
            ].map((benefit, i) => (
              <div
                key={i}
                className="p-6 rounded-xl hover:bg-[#FAFAFA] transition-all duration-300 group"
              >
                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#4C7EFF]">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
            {[
              'Connect your accounts securely',
              'We analyze your digital footprint',
              'Get personalized insight cards'
            ].map((step, i) => (
              <div key={i} className="relative mb-16 last:mb-0">
                <div className="flex items-center">
                  <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#4C7EFF] text-white flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right pr-16' : 'pl-16'}`}>
                    <p className="text-lg font-medium">{step}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Block */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block p-4 rounded-full bg-blue-50 mb-8">
            <svg className="w-8 h-8 text-[#4C7EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-6">Your data, your control</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We never store your social media data. Your insights are generated in real-time and you can delete your account anytime. We're GDPR compliant and take your privacy seriously.
          </p>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-20 px-4 bg-gray-50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-3xl font-bold mb-8 text-center">Try it with sample data</h2>
            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
              <button
                onClick={() => setDemoVisible(true)}
                className="px-6 py-3 bg-[#4C7EFF] text-white rounded-full"
              >
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "It's like having a personal data scientist for my social media.",
                author: "Alex K."
              },
              {
                quote: "The insights are surprisingly accurate and fun to share.",
                author: "Sarah M."
              },
              {
                quote: "I love seeing the patterns in my music taste.",
                author: "James R."
              }
            ].map((testimonial, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm">
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <p className="font-medium">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 px-4 bg-blue-50" id="pricing">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg">
            <span className="font-bold">Free forever</span>
            <span className="text-gray-600 ml-2">•</span>
            <span className="text-gray-600 ml-2">No credit card required</span>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Common questions</h2>
          {[
            {
              q: "How do you protect my data?",
              a: "We use industry-standard encryption and never store your social media data permanently."
            },
            {
              q: "Can I delete my account?",
              a: "Yes, you can delete your account and all associated data at any time."
            },
            {
              q: "What social platforms do you support?",
              a: "Currently we support Spotify and Instagram, with more platforms coming soon."
            }
          ].map((faq, i) => (
            <div key={i} className="mb-4">
              <button
                onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                className="w-full text-left p-4 bg-white rounded-lg shadow-sm flex justify-between items-center"
              >
                <span className="font-medium">{faq.q}</span>
                <span className="transform transition-transform">
                  {activeAccordion === i ? '−' : '+'}
                </span>
              </button>
              {activeAccordion === i && (
                <div className="p-4 text-gray-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
} 