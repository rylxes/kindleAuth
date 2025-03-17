"use client";

import { useState, useEffect } from 'react';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface Organization {
  id: string;
  name: string;
  code: string;
  created_on: string;
  feature_flags?: any[];
}

export default function Organizations() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!isAuthenticated) return;

      setIsLoadingOrgs(true);
      try {
        const response = await fetch('/api/organizations');
        if (!response.ok) {
          throw new Error(`Failed to fetch organizations: ${response.status}`);
        }

        const data = await response.json();
        setOrganizations(data.organizations || []);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setIsLoadingOrgs(false);
      }
    };

    if (isAuthenticated) {
      fetchOrganizations();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <div className="container">Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="card start-hero">
          <p className="text-display-2">Please log in to view organizations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card start-hero">
        <p className="text-body-2">Kinde Management API</p>
        <p className="text-display-2">Your Organizations</p>
      </div>

      <section className="next-steps-section">
        {isLoadingOrgs ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            Loading organizations...
          </div>
        ) : error ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f44336', color: 'white' }}>
            {error}
          </div>
        ) : (
          <div>
            {organizations.length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>No organizations found</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      backgroundColor: 'white',
                      color: 'black',
                      boxShadow: 'var(--g-box-shadow)'
                    }}
                  >
                    <h3 style={{ fontSize: 'var(--g-font-size-large)', fontWeight: 'var(--g-font-weight-bold)', marginBottom: '0.5rem' }}>
                      {org.name}
                    </h3>
                    <p style={{ fontSize: 'var(--g-font-size-small)', marginBottom: '0.5rem' }}>
                      ID: {org.id}
                    </p>
                    <p style={{ fontSize: 'var(--g-font-size-small)', marginBottom: '0.5rem' }}>
                      Code: {org.code}
                    </p>
                    <p style={{ fontSize: 'var(--g-font-size-small)', marginTop: '1rem', color: 'var(--g-color-grey-600)' }}>
                      Created: {new Date(org.created_on).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}