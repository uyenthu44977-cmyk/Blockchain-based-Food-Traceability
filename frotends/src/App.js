import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import ProducerDashboard from "./pages/ProducerDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>

      <Header />

      <Routes>

        <Route path="/" element={<Home />} />

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