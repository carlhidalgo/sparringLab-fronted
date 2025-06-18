import HeroSection from '../components/HeroSection/HeroSection';
import ActivitiesSection from '../components/ActivitiesSection/ActivitiesSections';
import HeroSection2 from '../components/HeroSection/HeroSection2';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './home.css'; // Importar el archivo CSS


const Home = () => {
  return (
    <>
      {/* Se eliminaron las clases de animación de este div para permitir el parallax */}
      <div>
        <HeroSection />
      </div>

      <div className="home-section-animate activities-section-animation">
        <ActivitiesSection />
      </div>

      <div className="cta-banner">
        Para todo aquel quien quiera convertirse en mejor atleta ¡te invitamos a participar!
      </div>

      {/* Se eliminaron las clases de animación de este div para permitir el parallax */}
      <div>
        <HeroSection2 />
      </div>
    </>
  );
};

export default Home;