import React from "react";
import { Clock, Users, Building2, Sparkles } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Optimización de Tiempo",
      description: "Reducimos los tiempos de espera físicos mediante sistemas digitales inteligentes"
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Experiencia Mejorada",
      description: "Transformamos la manera tradicional de hacer filas en una experiencia moderna"
    },
    {
      icon: <Building2 className="w-6 h-6 text-blue-500" />,
      title: "Solución Versátil",
      description: "Nos adaptamos a diferentes tipos de negocios y necesidades específicas"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      title: "Innovación Constante",
      description: "Desarrollamos tecnología de vanguardia con visión universitaria"
    }
  ];

  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Sobre Nosotros
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            ¿Qué es Ttoca?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Ttoca es una startup tecnológica que nace con visión universitaria y espíritu emprendedor, 
            enfocada en transformar la manera en que las personas hacen filas mediante sistemas de gestión 
            de turnos digitales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white p-8 rounded-2xl shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Nuestra Misión
            </h3>
            <p className="text-lg text-gray-600">
              Brindar soluciones accesibles y modernas a través de una plataforma flexible con un solo click, 
              personalizable y escalable, ideal tanto para pequeños negocios como grandes empresas, 
              mejorando la experiencia de espera para todos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;