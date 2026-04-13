import * as React from 'react';

interface VerificationEmailProps {
  username: string;
  verificationLink: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
  username,
  verificationLink,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '500px' }}>
    <h1 style={{ color: '#1F2937' }}>Welcome to UptimeMonitor, {username}!</h1>
    
    <p style={{ color: '#4B5563', fontSize: '16px', lineHeight: '1.6' }}>
      Thanks for signing up. Please verify your email address by clicking the button below:
    </p>
    
    <a 
      href={verificationLink}
      style={{
        backgroundColor: '#2563EB',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '5px',
        textDecoration: 'none',
        display: 'inline-block',
        fontWeight: 'bold',
        marginTop: '20px',
        marginBottom: '20px'
      }}
    >
      Verify Email
    </a>
    
    <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
      This link expires in 24 hours.
    </p>
    
    <p style={{ fontSize: '12px', color: '#999', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
      If you didn't sign up, please ignore this email.
    </p>
  </div>
);