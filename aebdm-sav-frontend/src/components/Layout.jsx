// Dans Layout.jsx
import NavbarComponent from './NavbarComponent';

function Layout({ children }) {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <NavbarComponent />
      
      {/* --- MODIFICATION ICI --- */}
      <main className="flex-grow-1 main-background">
        {children}
      </main>
      
      <footer className="bg-light text-center text-muted p-3 mt-auto border-top">
        © {new Date().getFullYear()} AEBDM - Développé par Yassine.
      </footer>
    </div>
  );
}

export default Layout;