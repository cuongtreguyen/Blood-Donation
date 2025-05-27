const Footer = () => {
  return (
    <footer className="bg-red-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#"  style={{ color: "white", textDecoration: "none" }} className="hover:text-red-200 transition-colors">Home</a></li>
              <li><a href="#"  style={{ color: "white", textDecoration: "none" }} className="hover:text-red-200 transition-colors">Donate Blood</a></li>
              <li><a href="#"  style={{ color: "white", textDecoration: "none" }} className="hover:text-red-200 transition-colors">Find Centers</a></li>
              <li><a href="#"  style={{ color: "white", textDecoration: "none" }} className="hover:text-red-200 transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>123 Blood Center Street</li>
              <li>City, State 12345</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: info@lifeflow.com</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              <li>Monday - Friday: 8am - 8pm</li>
              <li>Saturday: 9am - 6pm</li>
              <li>Sunday: 10am - 4pm</li>
              <li>Emergency: 24/7</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe to our newsletter for updates</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md mb-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="w-full bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-md font-semibold transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-red-600 mt-8 pt-8 text-center">
          <p>© 2024 LifeFlow. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" style={{ color: "white", textDecoration: "none" }} className="hover:text-red-200 transition-colors mx-2">Privacy Policy</a>
            <a href="#" style={{ color: "white", textDecoration: "none" }} className="hover:text-red-200 transition-colors mx-2">Terms of Service</a>
            <a href="#" style={{ color: "white", textDecoration: "none" }} className="hover:text-red-200 transition-colors mx-2">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;