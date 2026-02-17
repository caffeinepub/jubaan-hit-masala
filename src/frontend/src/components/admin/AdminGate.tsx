import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Loader2 } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import ProfileSetupModal from '../auth/ProfileSetupModal';

interface AdminGateProps {
  children: ReactNode;
}

export default function AdminGate({ children }: AdminGateProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
    refetch: refetchProfile,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Show loading while initializing or checking admin status
  if (isInitializing || adminLoading) {
    return (
      <div className="container-custom py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container-custom py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">Please log in to access the admin panel</p>
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin
  if (isAdmin === false) {
    return (
      <div className="container-custom py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-4" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">You do not have permission to access this area</p>
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show profile setup modal if admin but no profile
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  return (
    <>
      {showProfileSetup && <ProfileSetupModal isOpen={true} onComplete={() => refetchProfile()} />}
      {children}
    </>
  );
}
