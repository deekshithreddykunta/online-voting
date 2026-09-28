import Background from "../../components/Background/Background";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Security from "../../components/Security/Security";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Footer from "../../components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Background />
      <Navbar />
      <Hero />
      <Security />
      <HowItWorks />
      <Footer />
    </>
  );
}