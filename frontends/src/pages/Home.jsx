import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";

export default function Home() {

  const navigate = useNavigate();
  
  const {
    setAddress,
    setRole,
  } = useWeb3();


  const connectAdmin = () => {

    setAddress("0xAdmin");

    setRole("ADMIN");

    navigate("/admin");
  };

  const goSearch = () => {
  navigate("/search-product");
};

return (
  <>

   <div className="stars">

  {[...Array(80)].map((_, i) => (

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

  ))}

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
    zIndex: 2,
  }}
>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
  <br />
        <button
          style={{
            fontFamily: "'Smooch Sans', sans-serif",
            padding: "20px 30px",
            background: "transparent",
            color: "#eae1ec",
            border: "2px solid #22b8ee",
            borderRadius: "50px",
            fontSize: "25px",
            cursor: "pointer",
            boxShadow:
              "0 0 10px #88b5bc, 0 0 25px #22d3ee",
          }}
          onClick={goSearch}
        >
          Search Products
        </button>
        <br />
        <button
          style={{
            fontFamily: "'Smooch Sans', sans-serif",
            padding: "20px 30px",
            background: "transparent",
            color: "#eae1ec",
            border: "2px solid #a322ee",
            borderRadius: "50px",
            fontSize: "25px",
            cursor: "pointer",
            boxShadow:
              "0 0 10px #b89bcf, 0 0 25px #a722ee",
          }}
          onClick={connectAdmin}
        >
          Connect Admin
        </button>

      </div>


      <h1
        style={{
          color: "#e0ffff",
          fontFamily: "'Black Ops One', cursive",
          textAlign: "center",
          fontSize: "85px",
          fontWeight: "400",
          letterSpacing: "3px",
          lineHeight: "1.2",
          textShadow: `
            0 0 5px #22d3ee,
            0 0 15px #22d3ee,
            0 0 35px #06b6d4,
            0 0 60px #0891b2
          `,
        }}
      >
        Blockchain Food
        <br />
        Traceability
      </h1>

    </div>
  </>
); 
}