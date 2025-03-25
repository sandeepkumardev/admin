"use client";

import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoLogOutOutline } from "react-icons/io5";

const Header = () => {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  return (
    <div className="w-full fixed top-0 bg-white z-20 border-b-2">
      <div className="px-5 w-full sticky top-0 bg-white">
        <div className="flex justify-between gap-3 py-3 items-center">
          <div className="flex gap-3 items-center">
            {/* <IoStorefront className="text-3xl" /> */}
            <h2 className="text-2xl text-dark-3 font-bold uppercase tracking-wide">Silkyester</h2>
          </div>

          <div className={`flex gap-5 ${!user ? "hidden" : ""}`}>
            <IoLogOutOutline
              className="text-3xl cursor-pointer"
              onClick={() => {
                setUser(null);
                sessionStorage.removeItem("auth");
                router.replace("/sign-in");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
