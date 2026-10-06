import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Home,
  Award,
  Armchair,
  Truck,
  CheckCircle2,
} from "lucide-react";

// Local Images from assets
import homeBanner from "../assets/homebanner.png";
import decorateRoom from "../assets/Decorate room.png";
import innerPeace from "../assets/Inner Peace.png";
import diningSpace from "../assets/Dining Space.png";

import "./About.css";

const About = () => {
  return (
    <div className="about-page">

      <section
        className="about-hero"
        style={{ backgroundImage: `url(${homeBanner})` }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <span className="about-tag">ABOUT FURNIRO</span>
          <h1 className="about-hero-title">
            Where Comfort Meets Character
          </h1>
          <p className="about-hero-subtitle">
            Furniture is more than something you place in a room.
            It is what makes a space feel like home.
          </p>
          <Link to="/shop" className="about-btn-gold">
            <span>Explore Our Collection</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>


    
      <section className="about-story-section">
        <div className="about-container">
          <div className="about-story-grid">
            
            {/* Story Left: Image */}
            <div className="about-story-image-wrap">
              <img
                src={decorateRoom}
                alt="Furniro living room decoration"
                className="about-story-image"
              />
              <div className="about-story-badge">
                <span className="about-badge-number">100%</span>
                <span className="about-badge-text">Handcrafted Precision</span>
              </div>
            </div>

            {/* Story Right: Content */}
            <div className="about-story-content">
              <span className="about-subheading">OUR STORY</span>
              <h2 className="about-heading">
                Designed for spaces that feel like you.
              </h2>
              <p className="about-paragraph">
                At Furniro, we believe every home tells a story. Our goal is to
                help you build that story with furniture that combines comfort,
                functionality, and timeless design.
              </p>
              <p className="about-paragraph">
                From handcrafted teak wood finishes to ergonomic seating, each
                creation is shaped with care and purpose. We curate every piece
                so your everyday living becomes a serene, welcoming experience.
              </p>

              <Link to="/shop" className="about-story-link">
                <span>Discover Our Collection</span>
                <ArrowRight size={18} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      <section className="about-why-section">
        <div className="about-container">
          
          <div className="about-section-header">
            <span className="about-subheading">THE FURNIRO DIFFERENCE</span>
            <h2 className="about-heading">Why Choose Furniro?</h2>
            <p className="about-subtitle">
              Thoughtful design, reliable quality and a shopping experience made around you.
            </p>
          </div>

          <div className="about-why-grid">
            
            {/* Card 1 */}
            <div className="about-why-card">
              <div className="about-why-icon">
                <ShieldCheck size={28} />
              </div>
              <h3>Quality First</h3>
              <p>
                Premium kiln-dried woods, reinforced joinery, and resilient fabrics built to last generations.
              </p>
            </div>

            {/* Card 2 */}
            <div className="about-why-card">
              <div className="about-why-icon">
                <Sparkles size={28} />
              </div>
              <h3>Timeless Design</h3>
              <p>
                Organic silhouettes and warm natural textures that remain elegant as trends evolve.
              </p>
            </div>

            {/* Card 3 */}
            <div className="about-why-card">
              <div className="about-why-icon">
                <HeartHandshake size={28} />
              </div>
              <h3>Customer First</h3>
              <p>
                From product selection guidance to post-delivery care, we are here for you every step.
              </p>
            </div>

            {/* Card 4 */}
            <div className="about-why-card">
              <div className="about-why-icon">
                <Home size={28} />
              </div>
              <h3>Made for Your Space</h3>
              <p>
                Thoughtfully sized proportions and neutral color palettes that blend into any modern layout.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section
        className="about-quote-section"
        style={{ backgroundImage: `url(${innerPeace})` }}
      >
        <div className="about-quote-overlay"></div>
        <div className="about-quote-content">
          <span className="about-quote-mark">“</span>
          <h2 className="about-quote-text">
            A Beautiful Home Begins With The Right Pieces.
          </h2>
          <p className="about-quote-sub">
            Furniture that brings your space to life.
          </p>
        </div>
      </section>


      <section className="about-stats-section">
        <div className="about-container">
          <div className="about-stats-grid">

            <div className="about-stat-item">
              <h3 className="about-stat-number">10+</h3>
              <p className="about-stat-title">Furniture Categories</p>
              <span className="about-stat-desc">Living, Dining, Bedroom & Accents</span>
            </div>

            <div className="about-stat-item">
              <h3 className="about-stat-number">100+</h3>
              <p className="about-stat-title">Curated Products</p>
              <span className="about-stat-desc">Handpicked for modern homes</span>
            </div>

            <div className="about-stat-item">
              <h3 className="about-stat-number">1000+</h3>
              <p className="about-stat-title">Happy Customers</p>
              <span className="about-stat-desc">Trusted by families everywhere</span>
            </div>

            <div className="about-stat-item">
              <h3 className="about-stat-number">24/7</h3>
              <p className="about-stat-title">Dedicated Support</p>
              <span className="about-stat-desc">Help whenever you need assistance</span>
            </div>

          </div>

          <p className="about-stats-note">
            Thoughtfully selected collections crafted for everyday living.
          </p>
        </div>
      </section>


   
      <section className="about-promise-section">
        <div className="about-container">
          
          <div className="about-promise-top">
            <div>
              <span className="about-subheading">OUR PROMISE</span>
              <h2 className="about-heading">Quality. Comfort. Trust.</h2>
            </div>
            <p className="about-promise-intro">
              We stand behind every single piece we make. Here is our ongoing commitment to your home.
            </p>
          </div>

          <div className="about-promise-grid">
            
            <div className="about-promise-item">
              <span className="about-promise-num">01</span>
              <h4>Quality</h4>
              <p>
                Strict quality checks, genuine woods, and durable finishes that withstand real everyday moments.
              </p>
            </div>

            <div className="about-promise-item">
              <span className="about-promise-num">02</span>
              <h4>Comfort</h4>
              <p>
                Ergonomic testing for posture and relaxation, so you can truly unwind after a long day.
              </p>
            </div>

            <div className="about-promise-item">
              <span className="about-promise-num">03</span>
              <h4>Simplicity</h4>
              <p>
                Clear product descriptions, intuitive browsing, transparent pricing, and simple ordering.
              </p>
            </div>

            <div className="about-promise-item">
              <span className="about-promise-num">04</span>
              <h4>Trust</h4>
              <p>
                Honest craftsmanship, secure transactions, and reliable delivery right to your room.
              </p>
            </div>

          </div>

        </div>
      </section>


      
      <section className="about-process-section">
        <div className="about-container">
          
          <div className="about-section-header">
            <span className="about-subheading">HOW IT WORKS</span>
            <h2 className="about-heading">A Better Way to Shop Furniture</h2>
            <p className="about-subtitle">
              From finding inspiration to relaxing in your living room in four easy steps.
            </p>
          </div>

          <div className="about-process-grid">

            <div className="about-process-step">
              <div className="about-step-indicator">
                <span>01</span>
              </div>
              <h3>Discover</h3>
              <p>Explore furniture designed for modern spaces.</p>
            </div>

            <div className="about-process-step">
              <div className="about-step-indicator">
                <span>02</span>
              </div>
              <h3>Choose</h3>
              <p>Find products that match your style and space.</p>
            </div>

            <div className="about-process-step">
              <div className="about-step-indicator">
                <span>03</span>
              </div>
              <h3>Shop</h3>
              <p>Add your favourites to your cart and checkout easily.</p>
            </div>

            <div className="about-process-step">
              <div className="about-step-indicator">
                <span>04</span>
              </div>
              <h3>Enjoy</h3>
              <p>Bring your chosen pieces into your home.</p>
            </div>

          </div>

        </div>
      </section>


     
      <section className="about-values-section">
        <div className="about-container">
          <div className="about-values-grid">
            
            {/* Left Statement */}
            <div className="about-values-left">
              <span className="about-subheading">CORE PHILOSOPHY</span>
              <h2 className="about-heading">
                Good furniture should feel personal.
              </h2>
              <p className="about-paragraph">
                A home is a direct reflection of your personality and the life
                you build inside it. We craft furniture that balances artistic
                beauty with daily practicality, ensuring your space always feels
                welcoming and authentic.
              </p>
              <div className="about-values-pill">
                <CheckCircle2 size={18} color="#B88E2F" />
                <span>Hand-inspected for perfection</span>
              </div>
            </div>

            {/* Right 4 Value Cards */}
            <div className="about-values-right">
              
              <div className="about-value-box">
                <div className="about-value-header">
                  <Sparkles size={20} className="about-value-icon" />
                  <h4>Design</h4>
                </div>
                <p>Curated lines and harmonious proportions that elevate any interior.</p>
              </div>

              <div className="about-value-box">
                <div className="about-value-header">
                  <Award size={20} className="about-value-icon" />
                  <h4>Quality</h4>
                </div>
                <p>Authentic materials, resilient craftsmanship, and durable hardware.</p>
              </div>

              <div className="about-value-box">
                <div className="about-value-header">
                  <Armchair size={20} className="about-value-icon" />
                  <h4>Comfort</h4>
                </div>
                <p>Plush cushioning and ergonomic support made for daily living.</p>
              </div>

              <div className="about-value-box">
                <div className="about-value-header">
                  <Truck size={20} className="about-value-icon" />
                  <h4>Convenience</h4>
                </div>
                <p>Effortless browsing, prompt shipping, and customer-first support.</p>
              </div>

            </div>

          </div>
        </div>
      </section>


      
      <section
        className="about-cta-section"
        style={{ backgroundImage: `url(${diningSpace})` }}
      >
        <div className="about-cta-overlay"></div>
        <div className="about-cta-content">
          <span className="about-tag">START YOUR JOURNEY</span>
          <h2 className="about-cta-title">
            Ready to Create a Space You Love?
          </h2>
          <p className="about-cta-desc">
            Explore our collection and find pieces that belong in your home.
          </p>
          <Link to="/shop" className="about-btn-gold">
            <span>Shop Now</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;
