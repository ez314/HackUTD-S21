import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 bg-gray-900">
          <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-green-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"/>
            <div className="relative px-4 py-10 bg-black bg-opacity-75 shadow-lg sm:rounded-3xl sm:p-20">
              <div className="max-w-md mx-auto">
                <div className="flex justify-center pb-4">
                  <img src="/solace.png" className="h-24 sm:h-36"/>
                </div>
                <div className="divide-y divide-gray-600">

                  <div className="pt-3 text-base leading-6 font-bold sm:text-lg sm:leading-7">

                    <Link href="/api/login">
                      <div
                        className="relative px-3 py-8 bg-gray-700 sm:rounded-3xl sm:p-20 text-white font-mono hover:bg-gray-600 cursor-pointer text-2xl">
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