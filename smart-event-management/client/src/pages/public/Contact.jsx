import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
  };
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Contact Us</h1>
        <p className="text-center text-gray-600 mb-12">
          Have questions about an event or need assistance with registrations? Our team is here to help. 
          Reach out to us through the contact form or use the details below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
            <p className="text-gray-600 text-sm">support@smartevent.com</p>
            <p className="text-gray-600 text-sm">contact@smartevent.com</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Phone</h3>
            <p className="text-gray-600">+91 98765 43210</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
            <p className="text-gray-600 text-sm">Lovely Professional University</p>
            <p className="text-gray-600 text-sm">Phagwara, Punjab - 144411</p>
            <p className="text-gray-600 text-sm">India</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" className="input-field" placeholder="Enter your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" className="input-field" placeholder="Enter your email" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="tel" className="input-field" placeholder="Enter your phone number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input type="text" className="input-field" placeholder="Message subject" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                rows="5"
                className="input-field"
                placeholder="Your message"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary">
              Send Message
            </button>
          </form>
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Organization Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Smart Event Management System</h4>
              <p className="text-primary-100 text-sm mb-4">
                Your trusted partner for seamless event management, registration, and attendance tracking.
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <FaEnvelope className="mr-2" /> support@smartevent.com
                </p>
                <p className="flex items-center">
                  <FaPhone className="mr-2" /> +91 98765 43210
                </p>
                <p className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" /> LPU, Phagwara, Punjab
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Follow Us</h4>
              <div className="space-y-2 text-sm">
                <p>Instagram: <a href="https://instagram.com/smartevent" className="underline hover:text-primary-200" target="_blank" rel="noopener noreferrer">@smartevent</a></p>
                <p>Twitter/X: <a href="https://x.com/smartevent" className="underline hover:text-primary-200" target="_blank" rel="noopener noreferrer">@smartevent</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
