import AuthProvider from "@containers/authProvider/AuthProvider";
import EPermission from "@enums/EPermission";
import { ComponentType } from "react";

export default function withAuth(
  WrappedComponent: ComponentType,
  permission: EPermission,
) {
  return function WrappedWithAuth() {
    return (
      <AuthProvider permission={permission}>
        <WrappedComponent />
      </AuthProvider>
    );
  };
}
