import { AdminActions } from './AdminActions';
import { SystemStatus } from './SystemStatus';

export function AdminSidebar() {
  return (
    <>
      <AdminActions />
      <SystemStatus />
    </>
  );
}