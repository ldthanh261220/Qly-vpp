import { useSelector } from 'react-redux';

function Home() {
    const user = useSelector((state) => state.user.currentUser);

    return (
        <div>
            <h2>Home page</h2>
            {user ? (
                <div>
                    <p>
                        <strong>Xin chào,</strong> {user.hoTen || user.email || 'Người dùng'}!
                    </p>
                    <p>Email: {user.email}</p>
                    {/* Bạn có thể thêm nhiều thông tin hơn tùy theo object user */}
                </div>
            ) : (
                <p>Chưa đăng nhập.</p>
            )}
        </div>
    );
}

export default Home;
