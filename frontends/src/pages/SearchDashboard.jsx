import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ethers } from "ethers";
import contractArtifact from "../abi/FoodTrace.json";


const CONTRACT_ADDRESS =
  "0x396d259fE4b57859d5E05AE30Cb7d667aAc6d234";


const provider = new ethers.JsonRpcProvider(
  "https://ethereum-sepolia-rpc.publicnode.com"
);


const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  contractArtifact.abi,
  provider
);
export default function SearchDashboard() {


  const [searchParams] = useSearchParams();


  const qrBatchId =
    searchParams.get("batchId");
  const [batchId, setBatchId] =
    useState(qrBatchId || "");
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);


  const [transportHistory, setTransportHistory] = useState([]);


  const [safeInfo, setSafeInfo] = useState(null);


 const searchProduct = useCallback(async (id = batchId) => {
  console.log("Contract:", contract);
  console.log("BatchID:", id);
    try{


        const result =
          await contract.getBatchFullInfo(id);


        const batch = result[0];
        const transports = result[1];
        const recallReason = result[2];


        const histories =
          await contract.getHistory(id);


        const safe =
          await contract.isProductSafe(id);


        setHistory(histories);


        setTransportHistory(transports);


        setSafeInfo({


              safe: safe[0],


              message: safe[1]


        });
        setProduct({


          batchId: id,


          batchCode: batch.batchCode,


          origin: batch.origin,


          quantity: batch.quantity.toString(),


          certHash: batch.certHash,


          certType: batch.certType,


          status: Number(batch.status),


          plantingArea: batch.plantingAreaCode,


          packingHouse: batch.packingHouseCode,


          exportMarket: batch.exportMarket,


          recalled: !batch.isActive,


          recallReason: recallReason


        });


    }
    catch(err){


        setProduct(null);


        alert("Không tìm thấy sản phẩm");


    }
  }, [batchId]);


useEffect(() => {
    if(qrBatchId){
        searchProduct(qrBatchId);
    }


}, [qrBatchId]);


  const scanQR = () => {
    if (
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia
    ) {


        alert(
            "Chức năng quét QR sẽ mở camera."
        );


    } else {


        alert("Thiết bị không hỗ trợ camera.");

    }
    


};






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
          onClick={() => searchProduct(batchId)}


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
        <h2
        style={{
        textAlign:"center"
        }}
        >


        Batch: {product.batchCode}


        </h2>








        <p>
          🌱 Nguồn gốc: {product.origin}
        </p>


        <p>
        🆔 Batch ID: {product.batchId}
        </p>


        <p>
        📍 Mã vùng trồng: {product.plantingArea}
        </p>


        <p>
        🏭 Cơ sở đóng gói: {product.packingHouse}
        </p>


        <p>
        🌍 Thị trường xuất khẩu: {product.exportMarket}
        </p>


        <p>
        📦 Số lượng: {product.quantity}
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


            {
          [
          "Created",
          "Harvested",
          "Processing",
          "Packed",
          "Transporting",
          "Delivered",
          "Recalled"
          ][product.status]
          }
          </span>


        </p>
        {safeInfo && (
        <>
        <h3>Đánh giá an toàn</h3>


        <p
          style={{
            color: safeInfo.safe ? "#00ff99" : "#ff4444",
            fontWeight:"bold"
          }}
        >
          {safeInfo.message}
        </p>
        </>
        )}


        {
          product.recalled && (
            <div style={{ color:"#ff4444" }}>
              <p>⚠️ Lô hàng đã bị thu hồi</p>
              <p>Lý do: {product.recallReason}</p>
            </div>
          )
        }






        <h3>


          Blockchain Timeline


        </h3>






        {


          history.map((item,index)=>(


          <div
          key={index}
          style={{
          borderLeft:"3px solid #22d3ee",
          paddingLeft:"20px",
          marginBottom:"20px"
          }}
          >


          <p>


          Trạng thái:


          {
          [
          "Created",
          "Harvested",
          "Processing",
          "Packed",
          "Transporting",
          "Delivered",
          "Recalled"
          ][Number(item.status)]
          }


          </p>


          <p>


          {
          new Date(
          Number(item.timestamp)*1000
          ).toLocaleString()
          }


          </p>


          <p>


          {item.actor}


          </p>


          </div>


          ))


        }








        <h3>


          Chứng nhận


        </h3>
       
          <p>


          📄 Loại chứng nhận:


          {product.certType}


          </p>


          <a


          href={`https://gateway.pinata.cloud/ipfs/${product.certHash}`}


          target="_blank"


          rel="noreferrer"


          style={{color:"#22d3ee"}}


          >


          Xem chứng nhận


          </a>
          <h3>


          Lịch sử vận chuyển


          </h3>
       
          {


          transportHistory.map((item,index)=>(


            <div
              key={index}
              style={{


                borderLeft:"3px solid #00ff99",


                paddingLeft:"20px",


                marginBottom:"15px"


              }}
            >
         
              <p>


                Địa điểm:


                {item.location}


              </p>


              <p>


                Nhiệt độ:


                {item.temperature.toString()}°C


              </p>


              <p>


                {
                  new Date(
                    Number(item.timestamp)*1000
                  ).toLocaleString()
                }
              </p>


            </div>


          ))
          }
      </div>
     }
        </div>
  );



}
