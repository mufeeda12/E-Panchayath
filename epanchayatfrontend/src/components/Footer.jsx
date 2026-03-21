const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-light">e-Panchayat</h3>
            <p className="text-gray-400 text-sm">
              Citizen Issue Reporting System for effective civic management and rapid response.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">Email: support@epanchayat.gov.in</p>
            <p className="text-gray-400 text-sm">Phone: 1800-XXX-XXXX</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Government of India</h3>
            <p className="text-gray-400 text-sm">
              Empowering local governance through digital transformation.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} e-Panchayat Citizen Issue Reporting System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
