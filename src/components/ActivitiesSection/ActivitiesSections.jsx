import React, { useEffect, useRef } from 'react';
import './ActivitiesSection.css';

function ActivitiesSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const elementsToObserve = [titleRef.current, textRef.current, ...cardRefs.current].filter(Boolean);
    elementsToObserve.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      elementsToObserve.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const activities = [
    {
      name: 'Sparring',
      imageUrl: 'https://marxial.pe/cdn/shop/articles/Que_es_el_Sparring_en_el_Boxeo.jpg?v=1629233870',
      description: 'Practica tus combinaciones y defensa en un combate controlado. Esencial para pulir técnica y estrategia en tiempo real.'
    },
    {
      name: 'Torneos',
      imageUrl: 'https://t4.ftcdn.net/jpg/04/29/51/81/360_F_429518118_k4gpunbwSm2xBDLX71kzWhFPGLvi1Cab.jpg',
      description: 'Mide tu progreso y temple compitiendo contra otros boxeadores. ¡La adrenalina y la gloria te esperan en el cuadrilátero!'
    },
    {
      name: 'Entrenamiento',
      imageUrl: 'https://suelosport.com/wp-content/uploads/2023/10/entrenamiento-funcional-Suelosport.jpg',
      description: 'Desarrolla fuerza, velocidad, resistencia y agilidad con rutinas específicas para boxeadores. Supera tus límites día a día.'
    },
    {
      name: 'Gimnasios',
      imageUrl: 'https://media.revistagq.com/photos/65b12cfd195fefc5e6d8fe02/3:2/w_2559,h_1706,c_limit/fitness%20portada.jpg',
      description: 'Equipamiento de primera y espacios optimizados para tu preparación. Encuentra el ambiente perfecto para enfocarte en tus metas.'
    }
  ];

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, activities.length);
  }, [activities.length]);

  return (
    <div className="activities-container" ref={sectionRef}>
      <h2 ref={titleRef}>Nuestras Actividades</h2>
      <p className="boxing-explanation-text" ref={textRef}>
        Forja tu disciplina, domina la técnica y libera tu poder en el ring. Desde el combate táctico del sparring hasta la adrenalina de los torneos, cada actividad está diseñada para llevarte al límite y más allá.
      </p>
      <div className="activity-grid">
        {activities.map((activity, index) => (
          <div
            key={index}
            ref={el => cardRefs.current[index] = el}
            className={`activity-card ${index % 2 === 0 ? 'from-left' : 'from-right'}`}
            style={{
              backgroundImage: `url('${activity.imageUrl}')`,
            }}
          >
            <span className="activity-text">{activity.name}</span>
            <div className="activity-description-container">
              <p className="activity-description-text">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivitiesSection;
