interface HeaderProps {
  title?: string;
  subtitle?: string;
  onNavigate?: (path: string) => void;
}

export default function Header({
  title = 'Personal Contact Manager',
  subtitle,
  onNavigate: _onNavigate,
}: HeaderProps) {
  const onNavigate = _onNavigate;
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>
          {onNavigate && (
            <nav className="space-x-4">
              <button
                onClick={() => onNavigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('/contacts')}
                className="text-gray-600 hover:text-gray-900"
              >
                Contacts
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
