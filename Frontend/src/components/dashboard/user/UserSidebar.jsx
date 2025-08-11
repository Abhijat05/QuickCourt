import { UserProfile } from "./UserProfile";
import { QuickActions } from "./QuickActions";
import { FavoriteSports } from "./FavoriteSports";

export function UserSidebar({ dashboardData, twoFactorEnabled, onToggle2FA }) {
  return (
    <>
      <UserProfile twoFactorEnabled={twoFactorEnabled} onToggle2FA={onToggle2FA} />
      <QuickActions />
      {dashboardData?.favoriteSports && dashboardData.favoriteSports.length > 0 && (
        <FavoriteSports sports={dashboardData.favoriteSports} />
      )}
    </>
  );
}