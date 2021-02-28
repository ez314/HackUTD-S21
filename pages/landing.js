import Link from "next/link";

export default function LandingPage() {
    return (
        <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 bg-gray-800">
        <div class="relative py-3 sm:max-w-xl sm:mx-auto">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-green-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div class="max-w-md mx-auto">
              <div class="flex justify-center pb-4">
                <img src="/solace.png" class="h-24 sm:h-36"/>
              </div>
              <div class="divide-y divide-gray-200">
                
                <div class="pt-3 text-base leading-6 font-bold sm:text-lg sm:leading-7">

                <Link  href="/api/login">
                  <div class="relative px-3 py-8 bg-gray-700 shadow-lg sm:rounded-3xl sm:p-20 text-white font-mono hover:bg-gray-800 cursor-pointer text-2xl">
                        Login to Discord
                    </div>
                    </Link>
                  </div>
      
                </div>
              </div>
            </div>
          </div>
        </div>
      

    )
}