import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Featured from "@/components/Featured";
import Promo from "@/components/Promo";
import PixelMap from "@/components/PixelMap";
import RegisterForm from "@/components/RegisterForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Featured />
      <Promo />
      <PixelMap />
      <RegisterForm />
      <Footer />
    </main>
  );
};

export default Index;
