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
			const SocialLoginSDK = new SocialLogin();
			await socialLoginSDK.init(
				ethers.utils.hexValue(ChainId.POLYGON_MUMBAI)
			);
			sdkRef.current = socialLoginSDK;
		}
		if (!sdkRef.current.provider) {
			sdkRef.current.showConnectModal();
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
		setSmartAccount(null);
		enableInterval(false);
	}

	return <div>Auth</div>;
}

export default Auth;
