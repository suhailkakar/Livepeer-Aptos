import Image from "next/image";
import Link from "next/link";
import React from "react";
import Jazzicon from "react-jazzicon";

export default function Nav({ account }: { account?: any }) {
  return (
    <header className="relative py-4 md:py-6">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="hover:cursor-pointer">
              <Image
                src={"/assets/livepeer-logo.png"}
                alt="Livepeer Logo"
                width={100}
                height={50}
              />
            </Link>
          </div>

          <div className="hidden lg:flex lg:ml-10 xl:ml-16 lg:items-center lg:justify-center lg:space-x-8 xl:space-x-16">
            <Link
              href="/"
              className="text-base font-regular text-white transition-all duration-200 rounded focus:outline-none font-sans hover:text-opacity-50 "
            >
              Home
            </Link>
            <Link
              href="https://docs.livepeer.studio/quickstart"
              className="text-base font-regular text-white transition-all duration-200 rounded focus:outline-none font-sans hover:text-opacity-50 "
            >
              Livepeer Docs
            </Link>
            <Link
              href="https://aptos.dev/"
              className="text-base font-regular text-white transition-all duration-200 rounded focus:outline-none font-sans hover:text-opacity-50 "
            >
              Aptos Docs
            </Link>
            <Link
              href="https://github.com/suhailkakar/Livepeer-Aptos"
              className="text-base font-regular text-white transition-all duration-200 rounded focus:outline-none font-sans hover:text-opacity-50 "
            >
              GitHub Repo
            </Link>
            {account && (
              <Link
                href="/"
                className="text-base font-regular text-white transition-all duration-200 rounded focus:outline-none font-sans hover:text-opacity-50  mt-2"
              >
                <Jazzicon diameter={35} seed={account?.address} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
