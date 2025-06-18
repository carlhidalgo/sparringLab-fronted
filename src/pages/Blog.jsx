import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Blog.css'; // Importar el nuevo archivo CSS

const Blogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/blogs/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error("Error al cargar blogs:", err);
        setError('Error al obtener los blogs. Intenta recargar la página.');
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const handleCreateBlog = async (e) => {
    e.preventDefault(); // Prevenir recarga de página si es un form
    if (!titulo.trim() || !contenido.trim()) {
      alert('Por favor ingrese un título y contenido válidos.');
      return;
    }

    if (!user || !user.id) { // Verificar también user.id por si el objeto user está pero sin id
      alert('No estás logueado o tu sesión es inválida. Por favor inicia sesión.');
      return;
    }

    const newBlog = {
      titulo: titulo,
      contenido: contenido,
      user_id: user.id,
    };

    try {
      const response = await fetch('http://localhost:8000/api/create-blog/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Considerar añadir token de autenticación si es necesario para el backend
          // 'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(newBlog),
      });

      const data = await response.json();

      if (response.ok) {
        // Asumiendo que el backend devuelve el blog creado con su user_profile anidado
        // Si no, necesitarías hacer un fetch del perfil o construirlo manualmente
        const newBlogWithAuthor = {
          ...data.data, // El blog creado
          user_profiles: user.user_metadata || { first_name: user.email?.split('@')[0], last_name: '' } // Fallback
        };
        setBlogs((prevBlogs) => [newBlogWithAuthor, ...prevBlogs]); // Añadir al inicio para ver el más reciente primero
        setTitulo('');
        setContenido('');
        alert('Blog creado con éxito');
      } else {
        alert(data.error || 'Hubo un error al crear el blog');
      }
    } catch (err) {
      console.error('Error creando blog:', err);
      alert('Hubo un error al crear el blog. Revisa la consola para más detalles.');
    }
  };

  if (loading) return <div className="blog-page-container"><p className="blog-message">Cargando blogs...</p></div>;
  if (error) return <div className="blog-page-container"><p className="blog-message">Error: {error}</p></div>;

  return (
    <div className="blog-page-container">
      <h1 className="blog-main-title">Blog de la Comunidad</h1>
      
      {user && (
        <div className="blog-create-form-container">
          <h3>Crear Nueva Publicación</h3>
          <form onSubmit={handleCreateBlog}>
            <input
              type="text"
              className="form-control blog-form-input"
              placeholder="Título Impactante para tu Artículo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            <textarea
              className="form-control blog-form-textarea"
              placeholder="Comparte tu conocimiento, estrategias o historias del ring..."
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              rows="6"
              required
            />
            <button type="submit" className="btn blog-create-button">
              Publicar Artículo
            </button>
          </form>
        </div>
      )}

      <div className="blog-list-container">
        {blogs.length === 0 ? (
          <p className="blog-message">Aún no hay publicaciones. ¡Sé el primero en compartir!</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <div className="card-body">
                <h4 className="blog-card-title">{blog.titulo}</h4>
                <p className="blog-card-content">{blog.contenido}</p>
                <small className="blog-card-meta">
                  Publicado por{' '}
                  <strong>
                    {blog.user_profiles?.first_name || 'Usuario'}{' '}
                    {blog.user_profiles?.last_name || ''}
                  </strong>
                  {' el '} 
                  {new Date(blog.fecha_creacion).toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Blogs;
