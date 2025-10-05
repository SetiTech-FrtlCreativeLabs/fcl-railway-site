import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Award, Globe, Zap, Shield, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Who is{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Frtl Creative Labs?
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              We are innovators, creators, and visionaries building the future of technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              At Frtl Creative Labs, we believe that innovation is the key to solving the world's most complex challenges. 
              We are dedicated to creating cutting-edge technological solutions that push the boundaries of what's possible, 
              while maintaining a commitment to ethical development and positive global impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center p-8 bg-white rounded-lg shadow-lg hover-lift"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Innovation First</h3>
              <p className="text-gray-600">
                We prioritize breakthrough technologies and novel approaches to problem-solving.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-8 bg-white rounded-lg shadow-lg hover-lift"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Ethical Development</h3>
              <p className="text-gray-600">
                Our solutions are built with responsibility, sustainability, and human welfare in mind.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center p-8 bg-white rounded-lg shadow-lg hover-lift"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Global Impact</h3>
              <p className="text-gray-600">
                We create technologies that make a positive difference on a worldwide scale.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do and shape our approach to innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for the highest quality in everything we create and deliver.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Integrity</h3>
              <p className="text-gray-600">
                We maintain the highest ethical standards in all our business practices.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaboration</h3>
              <p className="text-gray-600">
                We believe in the power of teamwork and diverse perspectives.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We constantly push boundaries and explore new possibilities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are a diverse group of engineers, scientists, designers, and visionaries 
              united by our passion for creating meaningful technological solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-sm p-8 text-center hover-lift"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">JD</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Jane Doe</h3>
              <p className="text-blue-600 font-medium mb-4">Chief Technology Officer</p>
              <p className="text-gray-600">
                Leading our quantum computing initiatives with over 15 years of experience in theoretical physics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-8 text-center hover-lift"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">JS</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">John Smith</h3>
              <p className="text-blue-600 font-medium mb-4">Head of AI Research</p>
              <p className="text-gray-600">
                Pioneering neural network optimization techniques and machine learning applications.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-8 text-center hover-lift"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">AB</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Alex Brown</h3>
              <p className="text-blue-600 font-medium mb-4">Blockchain Architect</p>
              <p className="text-gray-600">
                Designing secure and scalable blockchain solutions for enterprise applications.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Innovate Together?</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Join us in shaping the future of technology. Whether you're a developer, researcher, 
              or simply passionate about innovation, there's a place for you at Frtl Creative Labs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn btn-lg bg-white text-blue-600 hover:bg-gray-100 inline-flex items-center"
              >
                Get in Touch
              </a>
              <a
                href="/initiatives"
                className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 inline-flex items-center"
              >
                Explore Our Work
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
