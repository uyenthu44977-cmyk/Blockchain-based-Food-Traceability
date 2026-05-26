import { useState } from "react";


import { QRCodeCanvas } from "qrcode.react";


export default function ProducerDashboard() {


  const [productName, setProductName] =
    useState("");


  const [origin, setOrigin] =
    useState("");


  const [description, setDescription] =
    useState("");


  const [image, setImage] =
    useState(null);


  const [status, setStatus] =
    useState("Created");


  const [location, setLocation] =
    useState("");


  const [note, setNote] =
    useState("");


  const [selectedBatch, setSelectedBatch] =
    useState("");


  const [batches, setBatches] =
    useState([]);


  // CREATE BATCH
  const handleCreateBatch = () => {


    const newBatch = {
      id: batches.length + 1,


      productName,


      origin,


      description,


      image,


      status: "Created",


      history: [],
    };


    setBatches([...batches, newBatch]);


    setProductName("");
    setOrigin("");
    setDescription("");
  };


  // UPDATE STATUS
  const handleUpdateStatus = () => {


    const updated = batches.map((batch) => {


      if (batch.id === Number(selectedBatch)) {


        return {
          ...batch,


          status,


          history: [
            ...batch.history,


            {
              status,
              location,
              note,
            },
          ],
        };
      }


      return batch;
    });


    setBatches(updated);


    setLocation("");
    setNote("");
  };


  return (
    <div
  style={{
    padding: "40px",


    display: "flex",
    flexDirection: "column",


    alignItems: "center",


    minHeight: "100vh",


    textAlign: "center",
  }}
>
    <h1
  style={{
    fontFamily: "'Smooch Sans', sans-serif",
    fontSize: "70px",
    fontWeight: "700",


    background:
      "linear-gradient(90deg, #00d2ff, #7c4dff, #ff4fd8, #00d2ff)",


    backgroundSize: "300%",


    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",


    animation: "gradientMove 5s ease infinite",
  }}
>
  Producer Dashboard
</h1>
    <hr />
    <br />
    <h2
  style={{
    color: "#dbdce6",
    fontFamily: "'Nunito', sans-serif",
    fontSize: "23px",
  }}
>
  Tạo Batch Mới
</h2>
<br />


      <input
  type="text"
  placeholder="Tên sản phẩm"
  value={productName}
  onChange={(e) =>
    setProductName(e.target.value)
  }
  style={{
    width: "400px",
    padding: "10px",


    borderRadius: "14px",


    border: "1px solid #7c4dff",


    background: "rgba(255,255,255,0.06)",


    color: "#b794f4",


    fontFamily: "'Nunito', sans-serif",


    fontSize: "15px",


    outline: "none",


    backdropFilter: "blur(8px)",


    boxShadow:
      "0 0 12px rgba(124,77,255,0.2)",
  }}
/>


      <br />


      <input
  type="text"
  placeholder="Nguồn gốc"
  value={origin}
  onChange={(e) =>
    setOrigin(e.target.value)
  }
  style={{
    width: "400px",
    padding: "10px",
    borderRadius: "14px",
    border: "1px solid #7c4dff",
    background: "rgba(255,255,255,0.06)",
    color: "#b794f4",
    fontFamily: "'Nunito', sans-serif",
    fontSize: "15px",
    outline: "none",
    backdropFilter: "blur(8px)",
    boxShadow:
      "0 0 12px rgba(124,77,255,0.2)",
  }}
/>


      <br />


      <textarea
  placeholder="Mô tả sản phẩm"
  value={description}
  onChange={(e) =>
    setDescription(e.target.value)
  }
  style={{
    width: "400px",
    height: "100px",


    padding: "10px",


    borderRadius: "14px",


    border: "1px solid #7c4dff",


    background: "rgba(255,255,255,0.06)",


    color: "#b794f4",


    fontFamily: "'Nunito', sans-serif",


    fontSize: "15px",


    outline: "none",


    resize: "none",


    backdropFilter: "blur(8px)",


    boxShadow:
      "0 0 12px rgba(124,77,255,0.2)",
  }}
/>


      <br />


      <input
        type="file"
        onChange={(e) =>
          setImage(
            URL.createObjectURL(
              e.target.files[0]
            )
          )
        }
      />
<br />


     <button
  onClick={handleUdateStatus}
  style={{
    fontFamily: "'Nunito', sans-serif",
    fontSize: "15px",


    padding: "5px 15px",


    borderRadius: "18px",
    border: "none",


    background:
      "linear-gradient(to right, #00d2ff, #7c4dff)",


    color: "white",


    cursor: "pointer",


    boxShadow:
      "0 0 15px rgba(124,77,255,0.4)",
  }}
>
  Tạo Batch
</button>


      <br />
      <br />
      <hr />
       <br />


 <h2
  style={{
    color: "#dbdce6",
    fontFamily: "'Nunito', sans-serif",
    fontSize: "23px",
  }}
>
  Cập nhật trạng thái
</h2>
 <br />
   <select
  value={selectedBatch}
  onChange={(e) =>
    setSelectedBatch(e.target.value)
  }
  style={{
    width: "400px",
    padding: "15px",


    borderRadius: "14px",


    border: "1px solid #425ed9",


    background: "rgba(255,255,255,0.06)",


    color: "#e0dae9",


    fontFamily: "'Nunito', sans-serif",


    fontSize: "15px",


    outline: "none",


    backdropFilter: "blur(8px)",


    boxShadow:
      "0 0 12px rgba(124,77,255,0.2)",


    cursor: "pointer",
  }}
>
  <option value="">
    Chọn Batch
  </option>


  {batches.map((batch) => (
    <option
      key={batch.id}
      value={batch.id}
    >
      Batch {batch.id}
    </option>
  ))}
</select>
      <br />
      <select
  value={status}
  onChange={(e) =>
    setStatus(e.target.value)
  }
  style={{
    width: "400px",
    padding: "15px",
    borderRadius: "14px",
    border: "1px solid #4d77ff",
    background: "rgba(255,255,255,0.06)",
    color: "#e9e6ef",
    fontFamily: "'Nunito', sans-serif",
    fontSize: "15px",
    outline: "none",
    backdropFilter: "blur(8px)",
    boxShadow:
      "0 0 15px rgba(124,77,255,0.2)",
  }}
>
  <option>Harvested</option>
  <option>Processed</option>
  <option>Transporting</option>
  <option>Delivered</option>
  <option>Recalled</option>
</select>
      <br />


      <input
  type="text"
  placeholder="Địa điểm"
  value={location}
  onChange={(e) =>
    setLocation(e.target.value)
  }
  style={{
    width: "400px",


    padding: "14px",


    borderRadius: "14px",


    border: "1px solid #4d5fff",


    background:
      "rgba(255,255,255,0.06)",


    color: "#b794f4",


    fontFamily:
      "'Nunito', sans-serif",


    fontSize: "15px",


    outline: "none",


    backdropFilter: "blur(8px)",


    boxShadow:
      "0 0 12px rgba(124,77,255,0.2)",
  }}
/>
      <br />


      <textarea
  placeholder="Ghi chú"
  value={note}
  onChange={(e) =>
    setNote(e.target.value)
  }
  style={{
    width: "400px",


    height: "100px",


    padding: "14px",


    borderRadius: "14px",


    border: "1px solid #4d77ff",


    background:
      "rgba(255,255,255,0.06)",


    color: "#b794f4",


    fontFamily:
      "'Nunito', sans-serif",


    fontSize: "15px",


    outline: "none",


    resize: "none",


    backdropFilter: "blur(8px)",


    boxShadow:
      "0 0 12px rgba(124,77,255,0.2)",
  }}
/>
      <br />


         <button
  onClick={handleCreateBatch}
  style={{
    fontFamily: "'Nunito', sans-serif",
    fontSize: "15px",


    padding: "5px 15px",


    borderRadius: "18px",
    border: "none",


    background:
      "linear-gradient(to right, #00d2ff, #7c4dff)",


    color: "white",


    cursor: "pointer",


    boxShadow:
      "0 0 15px rgba(124,77,255,0.4)",
  }}
>
  Cập nhật
</button>


      <hr />
      <br />
      <br />


      <h2>Danh sách Batch</h2>
      <br />


      {batches.map((batch) => (


        <div
          key={batch.id}
          style={{
  width: "600px",


  background: "rgba(255,255,255,0.08)",


  border: "1px solid rgba(255,255,255,0.12)",


  borderRadius: "20px",


  padding: "30px",


  marginBottom: "40px",


  backdropFilter: "blur(12px)",


  boxShadow:
    "0 8px 30px rgba(0,0,0,0.25)",


  textAlign: "left",


  fontFamily: "'Nunito', sans-serif",
}}
        >


          <h3>
            {batch.productName}
          </h3>


          <p>
  <b>Origin:</b> {batch.origin}
</p>


<p>
  <b>Status:</b> {batch.status}
</p>


<p>
  <b>Batch ID:</b> #{batch.id}
</p>


          <p>
            {batch.description}
          </p>


          {batch.image && (
            <img
              src={batch.image}
              alt="product"
              width="200"
            />
          )}


          <br />
          <br />


          <div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    marginBottom: "20px",
  }}
>
  <QRCodeCanvas
    value={`http://localhost:3000/consumer?id=${batch.id}`}
    size={140}
  />
</div>


          <hr />


          <h4>Lịch sử vận chuyển</h4>


          {batch.history.map(
            (item, index) => (


              <div
                key={index}
                style={{
  background:
    "rgba(255,255,255,0.06)",


  border:
    "1px solid rgba(255,255,255,0.08)",


  borderRadius: "14px",


  padding: "15px",


  marginBottom: "15px",


  boxShadow:
    "0 4px 10px rgba(0,0,0,0.15)",
}}
              >


                <p>
                  <b>
                    {item.status}
                  </b>
                </p>


                <p>
                  📍 {item.location}
                </p>


                <p>
                  📝 {item.note}
                </p>


              </div>
            )
          )}


        </div>
      ))}


    </div>
  );
}

