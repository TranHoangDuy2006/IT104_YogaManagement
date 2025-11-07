/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../stores/userStore";
import { facebookLogin } from "../../slices/userSlice";

declare global {
	interface Window { FB?: any }
}

function loadFacebookSdk(appId: string) {
	return new Promise<void>((resolve, reject) => {
		if (window.FB) { resolve(); return; }
		// Create root if missing
		if (!document.getElementById("facebook-jssdk")) {
			const js = document.createElement("script");
			js.id = "facebook-jssdk";
			js.src = "https://connect.facebook.net/en_US/sdk.js";
			js.async = true;
			js.onload = () => {
				window.FB?.init({ appId, cookie: true, xfbml: false, version: "v19.0" });
				resolve();
			};
			js.onerror = () => reject(new Error("Failed to load Facebook SDK"));
			document.head.appendChild(js);
		} else {
			resolve();
		}
	});
}

export default function FacebookLoginButton({ onSuccess, disabled }: { onSuccess?: () => void; disabled?: boolean }) {
	const dispatch = useDispatch<AppDispatch>();
	const appId = import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined;
	const [loading, setLoading] = React.useState(false);

	const handleLogin = async () => {
		if (!appId) return;
		setLoading(true);
		try {
			await loadFacebookSdk(appId);
			window.FB.login((response: any) => {
				if (response.status === "connected") {
					const accessToken = response.authResponse.accessToken;
					window.FB.api(
						"/me",
						{ fields: "id,name,email,picture.type(large)", access_token: accessToken },
						(me: any) => {
							const email = me.email || `${me.id}@facebook.local`; // fallback if email permission denied
							dispatch(
								facebookLogin({
									email,
									fullName: me.name,
									avatar: me?.picture?.data?.url,
									facebookId: me.id,
								})
							).then(() => onSuccess && onSuccess());
						}
					);
				}
				setLoading(false);
			}, { scope: "public_profile,email" });
		} catch {
			setLoading(false);
		}
	};

	if (!appId) {
		return (
			<button type="button" className="w-full h-[44px] rounded-xl border border-slate-200 bg-white text-slate-700" disabled title="Thiếu VITE_FACEBOOK_APP_ID">
				Đăng nhập Facebook (chưa cấu hình)
			</button>
		);
	}

	const isDisabled = loading || disabled;

	return (
		<button
			type="button"
			onClick={handleLogin}
			disabled={isDisabled}
			className={`btn-press btn-fb-fancy w-full h-[44px] rounded-xl bg-[#1877F2] text-white font-semibold flex items-center justify-center gap-2 active:scale-[0.99] transition-all ${
				isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'
			}`}
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
				<path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24h11.495v-9.294H9.691V11.01h3.128V8.354c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.796.143v3.241l-1.919.001c-1.504 0-1.796.715-1.796 1.765v2.314h3.589l-.467 3.696h-3.122V24h6.116C23.407 24 24 23.407 24 22.676V1.324C24 .593 23.407 0 22.676 0z" />
			</svg>
			Đăng nhập bằng Facebook
		</button>
	);
}
