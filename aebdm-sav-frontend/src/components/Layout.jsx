import NavbarComponent from './NavbarComponent';

function Layout({ children }) {
  return (
    <div>
      <NavbarComponent />
      <main>{children}</main>
    </div>
  );
}

export default Layout;