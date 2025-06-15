import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const GoiThauDetail = () => {
  const { maGoiThau } = useParams();
  const [goiThau, setGoiThau] = useState(null);

  useEffect(() => {
    const fetchChiTiet = async () => {
      try {
        const res = await axios.get(`http://localhost:5005/v1/api/goithau/chitiet?maGoiThau=${maGoiThau}`);
        setGoiThau(res.data);
      } catch (err) {
        console.error("❌ Không lấy được chi tiết gói thầu", err);
      }
    };

    fetchChiTiet();
  }, [maGoiThau]);

  if (!goiThau) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="chi-tiet-goi-thau">
      <h2>Chi tiết Gói Thầu</h2>
      <p><strong>Tên:</strong> {goiThau.tenGoiThau}</p>
      <p><strong>Mô tả:</strong> {goiThau.moTaChitiet}</p>
      <p><strong>Lĩnh vực:</strong> {goiThau.tenLinhVuc || goiThau.maLinhVuc}</p>
      <p><strong>Ngày tạo:</strong> {goiThau.ngayTao}</p>

      <Link to={`/goithau/edit/${maGoiThau}`}>✏️ Sửa</Link>
    </div>
  );
};

export default GoiThauDetail;
