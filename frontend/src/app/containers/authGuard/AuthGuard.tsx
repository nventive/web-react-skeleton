import Loading from "@components/loading/Loading";
import { useUserStore } from "@stores/userStore";
import { ReactNode } from "react";
import { useLoadUser, useRedirectToLoginIfNoToken } from "./hooks";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user } = useUserStore();

  useRedirectToLoginIfNoToken();
  useLoadUser();

  return !user ? <Loading /> : children;
}
