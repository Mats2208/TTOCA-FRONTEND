import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';


const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-sky-100 text-sky-900 px-4 py-10">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in">
        {/* Main content container */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-sky-600 mb-2">404</h1>
          <h2 className="text-2xl md:text-3xl font-medium text-sky-800 mb-4">Página no encontrada</h2>
        </div>

        {/* Image container */}
        <div className="relative w-full max-w-md mx-auto mb-8">
          <img 
            src="/assets/404.svg" 
            alt="404 Error Illustration" 
            className="w-full h-auto object-contain rounded-xl shadow-lg"
          />
        </div>
        
        {/* Description */}
        <p className="text-lg text-sky-700 max-w-md text-center mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        
        {/* Action button */}
        <Link
          to="/"
          className="group flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          <Home className="w-5 h-5 transition-transform group-hover:rotate-12" />
          <span>Volver al inicio</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;