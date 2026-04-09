import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="re-canvas flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-[92px]">{children}</main>
      <div className="pb-10" />
      <Footer />
    </div>
  );
}

export default Layout; 