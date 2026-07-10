export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-center text-gray-600 text-sm">
            © {currentYear} Personal Contact Manager. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#privacy"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
