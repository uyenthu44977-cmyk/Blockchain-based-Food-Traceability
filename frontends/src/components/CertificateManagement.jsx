import { useState } from "react";


export default function CertificateManagement() {


  const [loading, setLoading] =
    useState(false);


  const [formData, setFormData] =
    useState({
      adminWallet: "",
      farmerWallet: "",
      certType: "",
      issueDate: "",
      expiryDate: ""
    });


  const [file, setFile] =
    useState(null);


  const uploadCertificate =
    async () => {


      try {


        if (!formData.adminWallet) {
          alert("Nhập ví Admin");
          return;
        }
        if (!formData.farmerWallet) {
          alert("Nhập ví Farmer");
          return;
        }
        if (!formData.certType) {
          alert("Nhập loại chứng nhận");
          return;
        }


        if (!file) {
          alert("Chọn file chứng nhận");
          return;
        }


        setLoading(true);


        const data =
          new FormData();


        data.append(
          "adminWallet",
          formData.adminWallet
        );
        data.append(
          "farmerWallet",
          formData.farmerWallet
        );


        data.append(
          "certType",
          formData.certType
        );


        data.append(
          "issueDate",
          formData.issueDate
        );


        data.append(
          "expiryDate",
          formData.expiryDate
        );


        data.append(
          "file",
          file
        );


        const res =
          await fetch(
            "http://localhost:3002/api/certificates/upload-certificate",
            {
              method: "POST",
              body: data
            }
          );


        const result =
          await res.json();


        if (!res.ok) {


          alert(
            result.message
          );


          return;
        }


        alert(
  `Upload thành công!\n\nCID: ${result.ipfsHash}\n\nhttps://gateway.pinata.cloud/ipfs/${result.ipfsHash}`
);


        setFormData({
          adminWallet: "",
          farmerWallet: "",
          certType: "",
          issueDate: "",
          expiryDate: ""
        });


        setFile(null);


      } catch (error) {


        console.log(error);


        alert(
          "Upload thất bại"
        );


      } finally {


        setLoading(false);


      }
    };


  return (


    <div style={styles.container}>


      <h2 style={styles.title}>
  Upload Certificate
  </h2>


      <input
  style={styles.input}
  placeholder="Admin Wallet"
  value={formData.adminWallet}
  onChange={(e)=>
    setFormData({
      ...formData,
      adminWallet:e.target.value
    })
  }
/>
     
      <input
  style={styles.input}
  placeholder="Farmer Wallet"
        value={formData.farmerWallet}
        onChange={(e)=>
          setFormData({
            ...formData,
            farmerWallet:e.target.value
          })
        }
      />


     


      <input
  style={styles.input}
  placeholder="Certificate Type"
        value={formData.certType}
        onChange={(e)=>
          setFormData({
            ...formData,
            certType:e.target.value
          })
        }
      />


     


      <input
    style={styles.input}
    type="date"
        value={formData.issueDate}
        onChange={(e)=>
          setFormData({
            ...formData,
            issueDate:e.target.value
          })
        }
      />


     


      <input
    style={styles.input}
    type="date"
        value={formData.expiryDate}
        onChange={(e)=>
          setFormData({
            ...formData,
            expiryDate:e.target.value
          })
        }
      />


     


      <input
    style={styles.file}
    type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e)=>
          setFile(
            e.target.files[0]
          )
        }
      />


   


      <button
    style={styles.button}
    onClick={uploadCertificate}
        disabled={loading}
      >
        {
          loading
          ? "Uploading..."
          : "Upload Certificate"
        }
      </button>


    </div>
  );
}
const styles = {


  container:{
    display:"flex",
    flexDirection:"column",
    gap:"18px",
    width:"100%"
  },


  title:{
    color:"#fff",
    fontSize:"32px",
    marginBottom:"10px"
  },
  title: {
  color: "#00BFFF",  
  fontSize: "32px",
  marginBottom: "10px",
  fontWeight: "bold",
 
},


  input:{
    width:"100%",
    height:"50px",


    background:"#1b1128",


    border:"2px solid #c3becd",


    borderRadius:"25px",


    padding:"0 20px",


    color:"#fff",


    fontSize:"18px",


    outline:"none",


    boxSizing:"border-box"
  },


  file:{
    width:"100%",


    padding:"14px 20px",


    background:"#1b1128",


    color:"#ddd",


    border:"2px solid #b9b6be",


    borderRadius:"25px",


    boxSizing:"border-box"
  },


  button:{
    width:"220px",


    height:"50px",


    borderRadius:"30px",


    border:"2px solid #5dff7b",


    background:"transparent",


    color:"#5dff7b",


    fontSize:"18px",


    fontWeight:"bold",


    cursor:"pointer"
  }


};

