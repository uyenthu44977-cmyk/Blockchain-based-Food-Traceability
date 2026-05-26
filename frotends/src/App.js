import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import ProducerDashboard from "./pages/ProducerDashboard";


import Header from "./components/Header";
import Footer from "./components/Footer";


import ConnectWallet from "./components/ConnectWallet";


function App() {


  return (


    <BrowserRouter>


      <Header />


      <ConnectWallet />


      <Routes>


        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/consumer"
          element={<ConsumerDashboard />}
        />


        <Route
          path="/producer"
          element={<ProducerDashboard />}
        />


      </Routes>


      <Footer />


    </BrowserRouter>
  );
}


export default App;

