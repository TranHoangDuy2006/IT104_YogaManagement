import { type JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../stores/userStore";
import type { User } from "../../types/User";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
	const userState = useSelector((state: RootState) => state.user);
	const reduxUser = userState.data;
	let currentUser: Partial<User> | null = reduxUser;
	if (!currentUser) {
		try {
			const userStr = localStorage.getItem('currentUser');
			currentUser = userStr ? JSON.parse(userStr) : null;
		} catch {
			currentUser = null;
		}
	}

	const [shouldRedirect, setShouldRedirect] = useState(false);
	const [showNoAccess, setShowNoAccess] = useState(false);

	useEffect(() => {
		if (!currentUser || (window.location.pathname.startsWith('/admin') && currentUser.role !== 'admin')) {
			const notifyTimer = setTimeout(() => {
				setShowNoAccess(true);
			}, 5000);
			const redirectTimer = setTimeout(() => {
				setShouldRedirect(true);
			}, 8000);
			return () => {
				clearTimeout(notifyTimer);
				clearTimeout(redirectTimer);
			};
		}
	}, [currentUser]);

	if (shouldRedirect) {
		return <Navigate to="/login" replace />;
	}

	if (!currentUser || (window.location.pathname.startsWith('/admin') && currentUser.role !== 'admin')) {
		return (
			<div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 relative">
				{showNoAccess && (
					<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-red-500 text-white rounded-lg shadow font-semibold text-lg animate-fade-in">
						<i className="fa-solid fa-circle-exclamation mr-2"></i>Bạn không có quyền truy cập
					</div>
				)}
				<div className="flex flex-col items-center gap-4 px-8 py-10 rounded-2xl border border-blue-200 shadow-2xl bg-white/80 animate-fade-in">
					<span className="inline-block animate-spin-slow text-blue-500">
						<svg xmlns='http://www.w3.org/2000/svg' className='h-10 w-10' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
							<circle cx="12" cy="12" r="10" stroke="#60A5FA" strokeWidth="4" fill="none" opacity="0.2" />
							<path d="M12 2a10 10 0 0 1 10 10" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
						</svg>
					</span>
					<div className="text-xl font-bold text-blue-700 tracking-wide animate-pulse">
						{showNoAccess ? "Bạn sẽ được điều hướng về trang đăng nhập" : "Đang kiểm tra quyền truy cập..."}
					</div>
					<div className="text-base text-gray-500 italic">Vui lòng chờ trong giây lát</div>
				</div>
				<style>{`
					@keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
					.animate-fade-in { animation: fade-in 0.7s ease; }
					@keyframes spin-slow { to { transform: rotate(360deg); } }
					.animate-spin-slow { animation: spin-slow 1.2s linear infinite; }
				`}</style>
			</div>
		);
	}

	if (currentUser.role === 'admin' && window.location.pathname.startsWith('/admin')) {
		return children;
	}

	if (currentUser.role === 'admin') {
		return <Navigate to="/admin" replace />;
	}

	return children;
};

export default ProtectedRoute;
