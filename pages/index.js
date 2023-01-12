import dynamic from "next/dynamic";
import { Suspense } from "react";


function Index(){
  const SocialLoginDynamic=dynamic(
    ()=>import("../components/Auth").then((response)=>response.default),
    {
      ssr:false,
    }
  )

    return (
      <>
        <Suspense fallback={<div>Loading</div>}>  
          <SocialLoginDynamic/>
        </Suspense>
      </>
    )

}

export default Index;