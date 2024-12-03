import Loading from "@components/loading/Loading";
import EPermission from "@enums/EPermission";
import { useUserStore } from "@stores/userStore";
import { ReactNode } from "react";
import { useCheckPermission } from "./hooks";

export default function AuthProvider({
  children,
  permission,
}: {
  children: ReactNode;
  permission: EPermission;
}) {
  const { user } = useUserStore();
  const allowed = useCheckPermission(permission);

  if (!user || allowed === undefined) return <Loading />;
  if (!allowed) return <div>Permission Denied</div>; // TODO: throw an error?

  return children;
}
