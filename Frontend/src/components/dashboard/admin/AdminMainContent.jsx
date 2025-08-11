import { AdminStats } from './AdminStats';
import { RecentUsers } from './RecentUsers';
import { PendingVenues } from './PendingVenues';

export function AdminMainContent({ adminData }) {
  return (
    <>
      <AdminStats adminData={adminData} />
      <RecentUsers recentUsers={adminData.recentUsers} />
      <PendingVenues pendingCount={adminData.pendingVenues} />
    </>
  );
}