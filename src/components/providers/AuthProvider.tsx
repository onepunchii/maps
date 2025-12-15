'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/AuthStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const { setUser, setProfile, isRestored } = useAuthStore();

    useEffect(() => {
        // Background validation logic
        // This runs immediately on mount, listening for auth state changes from Supabase
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                // Server confirmed valid session: update store
                // This will silently update the UI if data changed
                setUser(session.user);
            } else {
                // Session expired or user logged out: clear store
                // identifying event type can be useful here to avoid clearing on initial load if session check invalidates
                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setProfile(null);
                }
                // Note: We don't forcefully clear on *every* no-session event immediately 
                // to allow "offline" or "optimistic" view if desired, but for Auth security, 
                // if onAuthStateChange says no user, we generally should respect it eventually.
                // For now, mirroring strict sync:
                if (!session) {
                    setUser(null);
                    setProfile(null);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [setUser, setProfile]);

    // Anti-Flicker: Wait for local storage hydration
    // But *don't* wait for server response. 
    // If local storage has user, we render immediately.
    if (!isRestored) {
        return null; // or a minimal loading spinner
    }

    return <>{children}</>;
}
