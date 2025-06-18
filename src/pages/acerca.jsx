import React from 'react';
import './acerca.css'; // Importar el archivo CSS

const AcercaDe = () => {
  return (
    <div className="acerca-page-container"> {/* Aplicar clase contenedora */}
      <h2 className="acerca-title mb-4">Acerca de nosotros:</h2> {/* Aplicar clase al título */}
      <div className="row acerca-content-row"> {/* Aplicar clase a la fila de contenido */}
        <div className="col-md-6 acerca-text-column"> {/* Aplicar clase a la columna de texto */}
          <p>
            Somos un equipo conformado por tres estudiantes postulantes al título de analista programador ,
            comprometidos con la creación de soluciones tecnológicas eficientes y fáciles de usar.
            Este proyecto fue desarrollado con el objetivo de brindar acceso a contenido educativo de calidad,
            disponible para todos en cualquier momento.
          </p>
          <p>
            Nuestra misión es, mediante la tecnología poder educar e inspirar a las personas mediante
            los deportes de contacto y el ejercicio físico para proponer un mundo más sano y activo.
          </p>
        </div>
        <div className="col-md-6 acerca-info-column"> {/* Aplicar clase a la columna de información */}
          <h5>Información del Proyecto</h5>
          <ul>
            <li><strong>Nombre del Proyecto:</strong> SparringLab</li>
            <li><strong>Versión:</strong> 3.0.0</li>
            <li><strong>Desarrolladores:</strong> Italo Inocencio, Luis F. Martínez, Carlos Hidalgo</li>
            <li><strong>Tecnologías:</strong> React, Django, Supabase</li>
            <li><strong>Fecha de Lanzamiento:</strong> Mayo 2025</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AcercaDe;