import { useState, useEffect, useRef } from "react";
import SocialLogin, { socialLoginSDK } from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import { ethers } from "ethers";
import { css } from "@emotion/css";


function Auth() {

    const [smartAccount,setSmartAccount]=useState(null);
    const [interval,enableInterval]=useState(false);
    const sdkRef=useRef(null);
    const [loading,isLoading]=useState(false);


    async function login(){
        if(!sdkRef.current){
            const SocialLoginSDK=new SocialLogin()
            await socialLoginSDK.init(ethers.utils.hexValue(ChainId.POLYGON_MUMBAI))
            sdkRef.current=socialLoginSDK;
        }
        if(!sdkRef.current.provider){
            sdkRef.current.showConnectModal()
            sdkRef.current.showWallet()
            enableInterval(true)
        }else{
            setupSmartAccount()
        }
    }

    async function setupSmartAccount(){
        
    }


	return <div>Auth</div>;
}

export default Auth;
