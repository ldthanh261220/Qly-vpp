import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './chitietnghiemthu.scss';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, UploadCloudIcon } from 'lucide-react'; 
const ChitietNghiemThu = () => {

  const navigate=useNavigate();
  const [wordFile, setWordFile] = useState(null);
  const [sanPhamList, setSanPhamList] = useState([
    { id: 1, ten: 'Bàn', donVi: 'Cái', soLuong: 20, gia: 100000, hinhAnh: null, xacNhan: false },
    { id: 2, ten: 'Ghế', donVi: 'Cái', soLuong: 10, gia: 100000, hinhAnh: null, xacNhan: false },
    { id: 3, ten: 'Máy in', donVi: 'Cái', soLuong: 20, gia: 1100000, hinhAnh: null, xacNhan: false }
  ]);
  const handdanhsachnt=()=>{
    navigate(`/nghiemthu`);
  }
  const handleWordChange = (e) => {
    const file = e.target.files[0];
    if (file) setWordFile(file);
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedList = [...sanPhamList];
      updatedList[index].hinhAnh = URL.createObjectURL(file);
      console.log(updatedList)
      setSanPhamList(updatedList);
    }
  };

  const handleCheckChange = (index) => {
    const updatedList = [...sanPhamList];
    updatedList[index].xacNhan = !updatedList[index].xacNhan;
    setSanPhamList(updatedList);
  };

  return (
    <div className="contract-container">
      <h2>Chi tiết nghiệm thu</h2>
      <h3>Hợp đồng 01</h3>
      <div className="contract-info">
        <p><strong>Mã hợp đồng:</strong> HD1</p>
        <p><strong>Nhà thầu:</strong> Công Ty TNHH Thương Mại Văn Phòng Phẩm Phú Thịnh</p>
        <p><strong>Ngày bắt đầu:</strong> 22/2/2025</p>
        <p><strong>Ngày kết thúc:</strong> 22/2/2025</p>
        <p>
          <strong>Văn bản hợp đồng:</strong>{' '}
          <input type="file" accept=".doc,.docx" onChange={handleWordChange} />
         
        </p>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Đơn vị tính</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Hình ảnh</th>
            <th>Xác nhận</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {sanPhamList.map((sp, index) => (
            <tr key={sp.id}>
              <td>{sp.ten}</td>
              <td>{sp.donVi}</td>
              <td>{sp.soLuong}</td>
              <td>{sp.gia.toLocaleString()} vnd</td>
              <td>
                <label htmlFor={`file-upload-${index}`} style={{ cursor: 'pointer' }}>
                    <UploadCloudIcon size={20} />
                </label>
                <input
                    id={`file-upload-${index}`}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageChange(e, index)}
                />
                {sp.hinhAnh && <img src={sp.hinhAnh} alt="uploaded" width="40" />}
                </td>
              <td>
                <input type="checkbox" checked={sp.xacNhan} onChange={() => handleCheckChange(index)} />
              </td>
            <td><input type='text'></input></td>
            </tr>
          ))}
        </tbody>
      </table>

    
      <div className="button-wrapper">
        <button className="btn-danger" onClick={()=>handdanhsachnt()}>Từ chối</button>
        <button className="btn-primary" onClick={()=>handdanhsachnt()}>Xác nhận nghiệm thu</button>
      </div>
    </div>
  );
};

export default ChitietNghiemThu;
