"use client";

import React, { useState } from 'react';

// Using inline lucide-react icons for speed, assuming it is installed (it was in Phase 2)
import { Wallet, ArrowUpRight, History } from 'lucide-react';

export function WalletDashboard() {
  const [balanceUSD] = useState(1250.75);
  const [totalEarnedUSD] = useState(8430.00);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Mock ledger data
  const transactions = [
    { id: '1', date: '10 Avril 2026', type: 'Course Sale (92% Split)', amount: '+ $88.50', status: 'SUCCESS' },
    { id: '2', date: '08 Avril 2026', type: 'Course Sale (92% Split)', amount: '+ $44.25', status: 'SUCCESS' },
    { id: '3', date: '05 Avril 2026', type: 'Withdrawal (M-Pesa)', amount: '- $500.00', status: 'COMPLETED' },
  ];

  const handleWithdrawalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsWithdrawing(true);
    // Simulate API call
    setTimeout(() => {
      alert("Demande de retrait initiée. Vos fonds USD seront convertis en monnaie locale au taux du jour par Flutterwave.");
      setIsWithdrawing(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 0' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: '0.5rem' }}>Portefeuille Enseignant</h1>
          <p className="text-secondary">Gérez vos revenus USD et vos retraits vers Mobile Money / Banque.</p>
        </div>
      </div>

      {/* KPI Cards (Glassmorphism) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="glass glass-hover" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            <Wallet size={20} />
            <span style={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 'var(--text-sm)' }}>Solde Actuel (USD)</span>
          </div>
          <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-display)', color: 'var(--accent-gold)' }}>
            ${balanceUSD.toFixed(2)}
          </div>
        </div>

        <div className="glass glass-hover" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            <ArrowUpRight size={20} />
            <span style={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 'var(--text-sm)' }}>Revenus Totaux</span>
          </div>
          <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-display)' }}>
            ${totalEarnedUSD.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Withdrawal Section & Ledger */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
        
        {/* Withdrawal Form */}
        <div className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '1.5rem' }}>Demander un retrait</h3>
          <form onSubmit={handleWithdrawalRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Montant (USD)</label>
              <input 
                type="number" 
                min="50" 
                max={balanceUSD} 
                defaultValue="100"
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-glass)', 
                  borderRadius: '8px', 
                  color: 'white',
                  fontSize: 'var(--text-base)'
                }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Méthode de Payout</label>
              <select 
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-glass)', 
                  borderRadius: '8px', 
                  color: 'white',
                  fontSize: 'var(--text-base)',
                  appearance: 'none'
                }}
              >
                <option value="airtel_cd">Airtel Money (RDC)</option>
                <option value="orange_cd">Orange Money (RDC)</option>
                <option value="mpesa_cd">M-Pesa (RDC)</option>
                <option value="illicocash">Illicocash</option>
                <option value="bank">Virement Bancaire (SWIFT)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Numéro de compte / Téléphone</label>
              <input 
                type="text" 
                placeholder="+243..."
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-glass)', 
                  borderRadius: '8px', 
                  color: 'white',
                  fontSize: 'var(--text-base)'
                }} 
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? 'Traitement...' : 'Confirmer le retrait'}
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Les retraits Mobile Money sont traités instantanément.
            </p>
          </form>
        </div>

        {/* Transaction History */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <History size={20} color="var(--text-secondary)" />
            <h3 style={{ fontSize: 'var(--text-xl)' }}>Historique du registre</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transactions.map(tx => (
               <div key={tx.id} style={{ 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 padding: '1.5rem',
                 borderBottom: '1px solid var(--border-glass)'
               }}>
                 <div>
                   <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{tx.type}</p>
                   <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{tx.date}</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <p style={{ 
                     fontWeight: 600, 
                     color: tx.amount.startsWith('+') ? 'var(--success)' : 'var(--text-primary)',
                     fontSize: 'var(--text-lg)'
                   }}>
                     {tx.amount}
                   </p>
                   <span style={{ 
                     fontSize: '0.7rem', 
                     padding: '0.2rem 0.5rem', 
                     background: 'rgba(255,255,255,0.1)', 
                     borderRadius: '4px',
                     color: 'var(--text-secondary)'
                   }}>{tx.status}</span>
                 </div>
               </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
