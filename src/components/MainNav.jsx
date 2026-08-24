import { Link, useLocation } from 'react-router-dom'

function MainNav() {
  const location = useLocation()

  return (
    <nav className="main-nav">
      <Link
        to="/"
        className={location.pathname === '/' ? 'main-nav-link active' : 'main-nav-link'}
      >
        Fotoğraflar
      </Link>
      <Link
        to="/videolar"
        className={location.pathname === '/videolar' ? 'main-nav-link active' : 'main-nav-link'}
      >
        🎥 Videolar
      </Link>
    </nav>
  )
}

export default MainNav
