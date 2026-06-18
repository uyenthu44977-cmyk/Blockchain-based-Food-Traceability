import { useState } from "react";

export default function SearchDashboard() {

  const [batchId, setBatchId] = useState("");
  const [product, setProduct] = useState(null);


  const searchProduct = () => {

    // Demo data
    // Sau này thay bằng smart contract

    if(batchId === "BATCH001"){

      setProduct({

        name: "Organic Mango",

        origin: "Đồng Nai, Việt Nam",

        harvest: "10/06/2026",

        status: "An toàn",

        image:
          "https://images.unsplash.com/photo-1553279768-865429fa0078",


        certificates:[
          "VietGAP",
          "Organic Certificate"
        ],


        timeline:[

          {
            date:"01/06/2026",
            title:"Gieo trồng",
            desc:"Trang trại ABC"
          },

          {
            date:"10/06/2026",
            title:"Thu hoạch",
            desc:"Đã ghi nhận blockchain"
          },

          {
            date:"12/06/2026",
            title:"Vận chuyển",
            desc:"Nhiệt độ ổn định"
          },

          {
            date:"15/06/2026",
            title:"Đến cửa hàng",
            desc:"Sẵn sàng bán"
          }

        ]

      })

    }

    else{

      setProduct(null);

      alert("Không tìm thấy sản phẩm");

    }

  }



  const scanQR = () => {

    alert("Mở camera quét QR");

  }



  return (

   <div
style={{
  flex:1,
  display:"flex",
  flexDirection:"column",
  alignItems:"center",
  padding:"25px",
  fontFamily:"'Smooch Sans', sans-serif",
  color:"#e0ffff"
}}
>


      <h1

        style={{

          fontSize:"45px",

          marginBottom:"35px",

          fontFamily:"'Black Ops One', cursive",

          textShadow:

          "0 0 15px #22d3ee"

        }}

      >

      TRA CỨU SẢN PHẨM
      </h1>


      {/* SEARCH BOX */}


      <div

        style={{

          width:"650px",

          padding:"25px",

          borderRadius:"25px",

          background:"rgba(255,255,255,0.08)",

          border:"1px solid #22d3ee",

          boxShadow:

          "0 0 25px rgba(34,211,238,0.5)"

        }}

      >


        <div

          style={{

            display:"flex",

            gap:"15px"

          }}

        >


          <input

            value={batchId}

            onChange={(e)=>setBatchId(e.target.value)}

            placeholder="Nhập Batch ID"

            style={{

              flex:1,

              padding:"15px",

              borderRadius:"20px",

              background:"rgba(0,0,0,0.4)",

              border:"2px solid #22d3ee",

              color:"white",

              fontSize:"15px",

              outline:"none"

            }}

          />



          <button

            onClick={scanQR}

            style={{

              padding:"15px 25px",

              borderRadius:"20px",

              background:"transparent",

              color:"#00ff99",

              border:"2px solid #00ff99",

              cursor:"pointer",

              fontSize:"15px",

              boxShadow:

              "0 0 15px #00ff99"

            }}

          >

            Quét QR

          </button>


        </div>





        <button

          onClick={searchProduct}

          style={{

            marginTop:"20px",

            width:"100%",

            padding:"15px",

            borderRadius:"20px",

            background:"transparent",

            color:"#22d3ee",

            border:"2px solid #22d3ee",

            cursor:"pointer",

            fontSize:"15px",

            boxShadow:

            "0 0 15px #22d3ee"

          }}

        >

          Tìm kiếm

        </button>


      </div>





      {/* RESULT */}


      {

      product &&


      <div

        style={{

          marginTop:"40px",

          width:"650px",

          padding:"20px",

          borderRadius:"25px",

          background:"rgba(255,255,255,0.08)",

          border:"1px solid #22d3ee",

          boxShadow:

          "0 0 25px rgba(34,211,238,0.4)"

        }}

      >



        <img

          src={product.image}

          alt="product"

          style={{

            width:"250px",

            height:"200px",

            objectFit:"cover",

            borderRadius:"20px",

            display:"block",

            margin:"auto"

          }}

        />



        <h2

          style={{

            textAlign:"center"

          }}

        >

          {product.name}

        </h2>




        <p>
          🌱 Nguồn gốc: {product.origin}
        </p>


        <p>
          📅 Ngày thu hoạch: {product.harvest}
        </p>


        <p>

          🔒 Trạng thái:

          <span

            style={{

              color:"#00ff99",

              marginLeft:"10px",

              fontWeight:"bold"

            }}

          >

            {product.status}

          </span>

        </p>




        <h3>

          Blockchain Timeline

        </h3>



        {

          product.timeline.map((item,index)=>(

            <div

              key={index}

              style={{

                borderLeft:"3px solid #22d3ee",

                paddingLeft:"20px",

                marginBottom:"20px"

              }}

            >

              <b>

                {item.title}

              </b>

              <p>

                {item.date}

              </p>


              <small>

                {item.desc}

              </small>


            </div>


          ))

        }




        <h3>

          Chứng nhận

        </h3>



        {

          product.certificates.map((c,index)=>(

            <span

              key={index}

              style={{

                display:"inline-block",

                background:"rgba(0,255,153,0.15)",

                border:"1px solid #00ff99",

                padding:"8px 15px",

                borderRadius:"20px",

                marginRight:"10px"

              }}

            >

              ✅ {c}

            </span>


          ))

        }



      </div>


      }


    </div>

  );

}