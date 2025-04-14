import Footer from "layouts/Footer";

const WithFooter = ({ children }) => {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
};

export default WithFooter;
