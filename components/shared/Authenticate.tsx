"use client";

import { verifyHash } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import React from "react";

const Authenticate = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  React.useEffect(() => {
    const fetch = async () => {
      if (!user) {
        const hash = sessionStorage.getItem("auth");
        if (hash && verifyHash("admin", hash)) {
          setUser(hash);
        } else {
          router.replace("/sign-in");
        }
      }
    };
    fetch();
  }, [user, setUser, router]);

  return <>{children}</>;
};

export default Authenticate;
