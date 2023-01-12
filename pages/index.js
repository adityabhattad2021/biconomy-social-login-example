import dynamic from "next/dynamic";
import { Suspense } from "react";


function Index(){
  const SocialLoginDynamic=dynamic(
    ()=>{
      import("../components/Auth").then((res)=>res.default),
      {
        ssr:false,
      }
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