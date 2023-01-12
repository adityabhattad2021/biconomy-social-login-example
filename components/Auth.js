import { useState, useEffect, useRef } from "react";
import SocialLogin, { socialLoginSDK } from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import { ethers } from "ethers";
import { css } from "@emotion/css";

function Auth() {
	const [smartAccount, setSmartAccount] = useState(null);
	const [interval, enableInterval] = useState(false);
	const sdkRef = useRef(null);
	const [isloading, setIsLoading] = useState(false);

	useEffect(() => {
		let configureLogin;
		if (interval) {
			configureLogin = setInterval(() => {
				if (!!sdkRef.current?.provider) {
					setupSmartAccount();
					clearInterval(configureLogin);
				}
			}, 1000);
		}
	}, [interval]);

	async function login() {
		if (!sdkRef.current) {
			const socialLoginSDK = new SocialLogin();
			// const signature1 = await socialLoginSDK.whitelistUrl(
			// 	"http://localhost:3000"
			// );
			await socialLoginSDK.init({
				chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI),
				// whitelistUrls: {
				// 	"http://localhost:3000": signature1,
				// },
			});
			sdkRef.current = socialLoginSDK;
		}
		if (!sdkRef.current.provider) {
			sdkRef.current.showWallet();
			enableInterval(true);
		} else {
			setupSmartAccount();
		}
	}

	async function setupSmartAccount() {
		setIsLoading(true);
		sdkRef.current.hideWallet();

		const web3Provider = new ethers.providers.Web3Provider(
			sdkRef.current.provider
		);

		try {
			const smartAccount = new SmartAccount(web3Provider, {
				activeNetworkId: ChainId.POLYGON_MUMBAI,
				supportedNetworksIds: [ChainId.GOERLI, ChainId.POLYGON_MUMBAI],
			});
			await smartAccount.init();
			setSmartAccount(smartAccount);
			setIsLoading(false);
		} catch (error) {
			console.log("Error setting up a smart contract: ", error);
		}
	}

	async function logout() {
		if (!sdkRef.current) {
			console.error("Web3Modal not initialized");
			return;
		}
		await sdkRef.current.logout();
		sdkRef.current.hideWallet();
		setSmartAccount(null);
		enableInterval(false);
	}

	return (
		<div className={containerStyle}>
			<h1 className={headerStyle}>Biconomy Authentication Example</h1>
			{!smartAccount && !isloading && (
				<button className={buttonStyle} onClick={login}>
					Login
				</button>
			)}
			{isloading && <p>Loading your account details, please wait...</p>}
			{!!smartAccount && (
				<div className={detailsContainerStyle}>
					<h3>Smart Account Address:</h3>
					<p>{smartAccount.address}</p>
					<button className={buttonStyle} onClick={logout}>
						Logout
					</button>
				</div>
			)}
		</div>
	);
}

const detailsContainerStyle = css`
	margin-top: 10px;
`;

const buttonStyle = css`
	padding: 14px;
	width: 300px;
	border: none;
	cursor: pointer;
	border-radius: 999px;
	outline: none;
	margin-top: 20px;
	transition: all 0.25s;
	&:hover {
		background-color: rgba(0, 0, 0, 0.2);
	}
`;

const headerStyle = css`
	font-size: 44px;
`;

const containerStyle = css`
	width: 900px;
	margin: 0 auto;
	display: flex;
	align-items: center;
	flex-direction: column;
	padding-top: 100px;
`;

export default Auth;
