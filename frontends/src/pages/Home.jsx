import { useNavigate } from "react-router-dom";


import ConnectWallet from "../components/ConnectWallet";

export default function Home() {


  const navigate =
    useNavigate();


  const goSearch = () => {


    navigate(
      "/search-product"
    );


  };


  return (
    <>


      <div className="stars">


        {[...Array(80)].map(
          (_, i) => (


            <span
              key={i}
              className="star"
              style={{
                left:
                  `${Math.random() * 100}%`,


                width:
                  `${1 + Math.random() * 3}px`,


                height:
                  `${1 + Math.random() * 3}px`,


                animationDuration:
                  `${4 + Math.random() * 8}s`,


                animationDelay:
                  `${Math.random() * 8}s`
              }}
            />


          )
        )}


      </div>


            <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "120px",
          padding: "40px",
          minHeight: "70vh",
          position: "relative",
          zIndex: 2
        }}
      >

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "50px"
          }}
        >
          <button
            style={{
              fontFamily: "'Smooch Sans', sans-serif",
              padding: "20px 30px",
              background: "transparent",
              color: "#53b1ec",
              border: "2px solid #22b8ee",
              borderRadius: "50px",
              fontSize: "25px",
              cursor: "pointer",
              boxShadow: "0 0 10px #88b5bc, 0 0 25px #22d3ee"
            }}
            onClick={goSearch}
          >
            Search Products
          </button>

          <ConnectWallet />
        </div>

        {/* TITLE */}
        <div
          style={{
            textAlign: "center"
          }}
        >
          <h1
            style={{
              color: "#e0ffff",
              fontFamily: "'Black Ops One', cursive",
              fontSize: "85px",
              fontWeight: "400",
              letterSpacing: "4px",
              lineHeight: "1.1",
              margin: 0,
              textTransform: "uppercase",
              textShadow: `
                0 0 5px #22d3ee,
                0 0 15px #22d3ee,
                0 0 35px #06b6d4,
                0 0 60px #0891b2
              `
            }}
          >
            DURIANCHAIN
          </h1>

          <p
            style={{
              fontStyle: "italic",
              marginTop: "12px",
              color: "#a5f3fc",
              fontFamily: "'Smooch Sans', sans-serif",
              fontSize: "32px",
              letterSpacing: "2px",
              textShadow: "0 0 10px #22d3ee"
            }}
          >
            Blockchain-powered Durian Traceability
          </p>
        </div>

      </div>

    </>
  );
} 