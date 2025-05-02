import React, { useState } from 'react';
import './themkehoach.scss';

const danhSachThietBi = [
    { maThietBi: 'VP001', tenThietBi: 'Bút bi Thiên Long', giaBan: 3000 },
    { maThietBi: 'VP002', tenThietBi: 'Vở ghi chép 200 trang', giaBan: 12000 },
    { maThietBi: 'VP003', tenThietBi: 'Kẹp giấy', giaBan: 5000 }
  ];

const ThemKeHoach = ({onBack}) => {
  const [keHoach, setKeHoach] = useState({
    tenKeHoach: '',
    chuDauTu: '',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
    donVi: '',
    trangThai: 'Chờ duyệt',
    lyDoTuChoi: '',
    maTaiKhoan: '',
    loaikehoach: '',
    chiphi:0,
    danhSachThietBi: []
  });

  const [thietBiMoi, setThietBiMoi] = useState({
    maThietBi: '',
    tenThietBi: '',
    giaBan:0,
    soluong:0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKeHoach((prev) => ({ ...prev, [name]: value }));
  };

  const handleThietBiChange = (e) => {
    const { name, value } = e.target;
    setThietBiMoi((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddThietBi = () => {
    setKeHoach((prev) => {
      const existingIndex = prev.danhSachThietBi.findIndex(
        (tb) => tb.maThietBi === thietBiMoi.maThietBi
      );
  
      if (existingIndex !== -1) {
        // Nếu đã tồn tại, cập nhật số lượng
        const updatedDanhSach = [...prev.danhSachThietBi];
        updatedDanhSach[existingIndex].soluong =
          Number(updatedDanhSach[existingIndex].soluong || 0) + Number(thietBiMoi.soluong || 0);
  
        return {
          ...prev,
          danhSachThietBi: updatedDanhSach
        };
      } else {
        // Nếu chưa có, thêm mới
        return {
          ...prev,
          danhSachThietBi: [...prev.danhSachThietBi, { ...thietBiMoi }]
        };
      }
    });

    setThietBiMoi({
        maThietBi: '',
        tenThietBi: '',
        giaBan:0,
        soluong:0
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const confirmed = window.confirm('Bạn có chắc chắn muốn thêm kế hoạch này không?');
    if (confirmed) {
      console.log('Kế hoạch gửi đi:', keHoach);
      onBack(); // GỌI hàm
    }
  };
  

  return (
    <div className="form-container">
    <button className='btn-back' onClick={onBack}>← Quay lại danh sách</button>
      <h2>Thêm kế hoạch mua sắm</h2>
      <form onSubmit={handleSubmit}>
        <table className="form-table">
          <tbody>
            <tr>
              <td><label>Tên kế hoạch:</label></td>
              <td><input type="text" name="tenKeHoach" value={keHoach.tenKeHoach} onChange={handleChange} /></td>
            </tr>
        <tr>
        <td><label>Loại kế hoạch:</label></td>
        <td>
            <select name="loaikehoach" value={keHoach.loaikehoach} onChange={handleChange}>
            <option value="">-- Chọn loại kế hoạch --</option>
            <option value="Mua sắm">Mua sắm</option>
            <option value="Sửa chữa">Sửa chữa</option>
            </select>
        </td>
        </tr>
            <tr>
              <td><label>Thời gian bắt đầu:</label></td>
              <td><input type="date" name="thoiGianBatDau" value={keHoach.thoiGianBatDau} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td><label>Vị trí:</label></td>
              <td><input type="text" name="vitri" value={keHoach.donVi} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td><label>Mục đích:</label></td>
                <textarea
                name="mucDich"
                value={keHoach.mucDich || ''}
                onChange={handleChange}
                placeholder="Mục đích mua sắm"
                className="textarea-large"
                />
            </tr>
            <tr>
              <td><label>Chi phí dự tính:</label></td>
              <td><input type="number" name="chiphi" value={keHoach.chiphi} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>

        <hr />
        <h3>Thêm thiết bị</h3>
        <table className="form-table">
          <tbody>
            <tr>
            <td>Chọn thiết bị</td>
            <td>
            <select
                name="maThietBi"
                value={thietBiMoi.maThietBi}
                onChange={(e) => {
                const selectedMa = e.target.value;
                const selectedTB = danhSachThietBi.find(tb => tb.maThietBi === selectedMa);
                if (selectedTB) {
                    setThietBiMoi({
                    ...thietBiMoi,
                    maThietBi: selectedTB.maThietBi,
                    tenThietBi: selectedTB.tenThietBi,
                    giaBan: selectedTB.giaBan
                    });
                } else {
                    setThietBiMoi({ ...thietBiMoi, maThietBi: '', tenThietBi: '', giaBan: 0 });
                }
                }}
            >
                <option >---</option>
                {danhSachThietBi.map((tb) => (
                <option key={tb.maThietBi} value={tb.maThietBi}>
                    {tb.tenThietBi} ({tb.maThietBi})
                </option>
                ))}
            </select>
            </td>
            </tr>
            <tr>
              <td><label>Số lượng:</label></td>
              <td><input type="number" name="soluong" value={thietBiMoi.soluong} onChange={handleThietBiChange} /></td>
            </tr>
          </tbody>
        </table>
        <button type="button" className="btn-submit_thietbi" onClick={handleAddThietBi}>
          Thêm thiết bị
        </button>

        <table className="plan-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên</th>
              {keHoach.loaikehoach=='Mua sắm'&&<th>Giá</th>}
              <th>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {keHoach.danhSachThietBi.map((tb, index) => (
              <tr key={index}>
                <td>{tb.maThietBi}</td>
                <td>{tb.tenThietBi}</td>
                {keHoach.loaikehoach === 'Mua sắm' && (<td>{tb.giaBan===0?`Chưa có giá`:`${tb.giaBan.toLocaleString()} VND`}</td>)}      
                <td>{Number(tb.soluong).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
            <div className="button_wrapper">
            <button type="submit" className="btn-submit">Thêm kế hoạch</button>
            </div>
        
      </form>
    </div>
  );
};

export default ThemKeHoach;
