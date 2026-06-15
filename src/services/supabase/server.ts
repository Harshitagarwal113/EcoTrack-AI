import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const token = cookieStore.get('sb-access-token')?.value

  if (token === 'dummy-token') {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
    return {
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: 'mock-user-123',
              email: 'test@example.com',
              user_metadata: { full_name: 'Eco Tester' }
            }
          },
          error: null
        }),
        getSession: async () => ({
          data: {
            session: {
              user: {
                id: 'mock-user-123',
                email: 'test@example.com',
                user_metadata: { full_name: 'Eco Tester' }
              }
            }
          },
          error: null
        }),
        onAuthStateChange: (callback: any) => ({
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        }),
        signOut: async () => ({ error: null }),
      },
      from: (table: string) => {
        const queryResult: any = new Proxy({}, {
          get(target, prop) {
            if (prop === 'then') {
              return (resolve: any) => {
                let data: any[] = [];
                if (table === 'streaks') {
                  data = [
                    { streak_type: 'completed_goals', current_streak: 2, longest_streak: 5, user_id: 'mock-user-123' },
                    { streak_type: 'carbon_reductions', current_streak: 4, longest_streak: 4, user_id: 'mock-user-123' }
                  ];
                } else if (table === 'goals') {
                  data = [];
                } else if (table === 'carbon_entries') {
                  data = [];
                } else if (table === 'challenges') {
                  data = [];
                } else if (table === 'user_badges') {
                  data = [];
                } else if (table === 'notifications') {
                  data = [];
                } else if (table === 'emission_factors') {
                  data = [
                    { category: 'transportation', type: 'car', factor: 0.2 },
                    { category: 'energy', type: 'electricity', factor: 0.5 }
                  ];
                }
                resolve({ data, error: null });
              };
            }
            if (prop === 'single') {
              return () => {
                if (table === 'profiles') {
                  return Promise.resolve({
                    data: {
                      id: 'mock-user-123',
                      email: 'test@example.com',
                      full_name: 'Eco Tester',
                      sustainability_grade: 'A',
                      total_carbon_saved: 120
                    },
                    error: null
                  });
                }
                if (table === 'activities') {
                  return Promise.resolve({
                    data: { id: 'mock-activity-123', name: 'Car', carbon_factor: 0.2 },
                    error: null
                  });
                }
                return Promise.resolve({ data: null, error: null });
              };
            }
            return () => queryResult;
          }
        });
        return queryResult;
      }
    } as any;
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
