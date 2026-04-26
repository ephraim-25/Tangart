export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="glass" style={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 4rem)',
        maxWidth: '1400px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 100,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>
          Plam's Art<span className="text-gold">.</span>
        </div>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="#discover" className="btn-nav">Découvrir</a>
          <a href="#marketplace" className="btn-nav">Marketplace</a>
          <a href="#teach" className="btn-nav">Enseigner</a>
        </nav>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline">Se connecter</button>
          <button className="btn btn-primary">Rejoindre</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '160px',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Background ambient glow effect */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(10,10,10,0) 70%)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        <div className="container animate-fade-up">
          <h1 style={{ fontSize: 'var(--text-hero)', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto', letterSpacing: '-0.02em' }}>
            L'excellence de <br/>
            l'art, <span className="text-gold" style={{ fontStyle: 'italic' }}>transmise.</span>
          </h1>
          <p className="text-secondary delay-100 animate-fade-up" style={{ fontSize: 'var(--text-xl)', maxWidth: '600px', margin: '1.5rem auto 3rem auto', opacity: 0 }}>
            Une plateforme e-learning de prestige pour les artistes. Maîtrisez de nouvelles techniques, exposez vos œuvres et monétisez votre savoir.
          </p>
          
          <div className="delay-200 animate-fade-up" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', opacity: 0 }}>
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>Explorer les cours</button>
            <button className="btn glass glass-hover" style={{ padding: '1rem 2rem', fontSize: '1.125rem', color: 'var(--text-primary)' }}>Devenir Formateur</button>
          </div>
        </div>
      </section>

      {/* Featured Categories (Glassmorphism layout) */}
      <section className="section container" style={{ paddingBottom: '8rem' }}>
        <h2 className="animate-fade-up delay-300" style={{ fontSize: 'var(--text-3xl)', marginBottom: '3rem', textAlign: 'center', opacity: 0 }}>Disciplines Majeures</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {[
            { title: 'Peinture Classique', desc: 'Huile, acrylique et techniques de maîtres.', hue: '120' },
            { title: 'Sculpture & Modelage', desc: 'Du concept à la réalité tridimensionnelle.', hue: '45' },
            { title: 'Photographie d\'Art', desc: 'Lumière, composition et retouche.', hue: '210' }
          ].map((cat, i) => (
             <div key={i} className="glass glass-hover" style={{
               padding: '3rem 2rem',
               display: 'flex',
               flexDirection: 'column',
               gap: '1rem',
               position: 'relative',
               overflow: 'hidden'
             }}>
               {/* Ambient overlay inside card */}
               <div style={{
                 position: 'absolute',
                 top: 0, right: 0,
                 width: '150px', height: '150px',
                 background: `radial-gradient(circle, hsla(${cat.hue}, 40%, 30%, 0.15) 0%, transparent 70%)`,
                 transform: 'translate(30%, -30%)'
               }} />
               <h3 style={{ fontSize: 'var(--text-2xl)' }}>{cat.title}</h3>
               <p className="text-secondary">{cat.desc}</p>
               <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                 <span className="text-gold" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Explorer →</span>
               </div>
             </div>
          ))}
        </div>
      </section>

    </div>
  );
}
