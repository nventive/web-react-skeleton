import PermissionGuard from "@containers/permissionGuard/PermissionGuard";
import EPermission from "@enums/EPermission";
import { ComponentType } from "react";

export default function withPermissionGuard(
  WrappedComponent: ComponentType,
  permission: EPermission,
) {
  return function WrappedWithPermissionGuard() {
    return (
      <PermissionGuard permission={permission}>
        <WrappedComponent />
      </PermissionGuard>
    );
  };
}
