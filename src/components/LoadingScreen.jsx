import './LoadingScreen.scss';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      {/* Animated gradient background matching main page */}
      <div className="loading-gradient-bg"></div>
      
      {/* Grain overlay matching main page */}
      <div className="loading-grain"></div>

      <div className="loading-content">
        {/* Portfolio text with premium styling inside a glass pill */}
        <div className="loading-title-container glass-pill">
          <h1 className="loading-title">
            {['P','O','R','T','F','O','L','I','O'].map((letter, i) => (
              <span key={i} className="title-letter" style={{ '--i': i }}>
                {letter}
              </span>
            ))}
          </h1>
          <div className="loading-subtitle">Experience Loading...</div>
          
          {/* Integrated Bubble dots floating around the content */}
          <div className="bubble-loader">
            <div className="bubble-dot"></div>
            <div className="bubble-dot"></div>
            <div className="bubble-dot"></div>
            <div className="bubble-dot"></div>
            <div className="bubble-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
