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

    <div>

      <h2>
        Upload Certificate
      </h2>

      <input
        placeholder="Admin Wallet"
        value={formData.adminWallet}
        onChange={(e)=>
          setFormData({
            ...formData,
            adminWallet:e.target.value
          })
        }
      />
      <br />
      <input
        placeholder="Farmer Wallet"
        value={formData.farmerWallet}
        onChange={(e)=>
          setFormData({
            ...formData,
            farmerWallet:e.target.value
          })
        }
      />

      <br />

      <input
        placeholder="Certificate Type"
        value={formData.certType}
        onChange={(e)=>
          setFormData({
            ...formData,
            certType:e.target.value
          })
        }
      />

      <br />

      <input
        type="date"
        value={formData.issueDate}
        onChange={(e)=>
          setFormData({
            ...formData,
            issueDate:e.target.value
          })
        }
      />

      <br />

      <input
        type="date"
        value={formData.expiryDate}
        onChange={(e)=>
          setFormData({
            ...formData,
            expiryDate:e.target.value
          })
        }
      />

      <br />

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e)=>
          setFile(
            e.target.files[0]
          )
        }
      />

      <br />

      <button
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