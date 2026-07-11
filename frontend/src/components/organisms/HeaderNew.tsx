import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-sky-500 to-sky-400 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white rounded-lg p-2 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Personal Contact</h1>
              <p className="text-sky-50 text-sm">Gerenciador de Contatos</p>
            </div>
          </Link>

          {/* Avatar/Profile placeholder */}
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-opacity-30 transition-all">
            👤
          </div>
        </div>
      </div>
    </header>
  );
};
