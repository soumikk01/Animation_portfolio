import './LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      {/* Animated gradient background matching main page */}
      <div className="loading-gradient-bg"></div>
      
      {/* Grain overlay matching main page */}
      <div className="loading-grain"></div>

      <div className="loading-content">
        {/* Portfolio text with premium styling */}
        <div className="loading-title-container">
          <h1 className="loading-title">
            <span className="title-letter">P</span>
            <span className="title-letter">O</span>
            <span className="title-letter">R</span>
            <span className="title-letter">T</span>
            <span className="title-letter">F</span>
            <span className="title-letter">O</span>
            <span className="title-letter">L</span>
            <span className="title-letter">I</span>
            <span className="title-letter">O</span>
          </h1>
          <div className="loading-subtitle">Experience Loading...</div>
        </div>

        {/* Bubble loading animation */}
        <div className="bubble-loader">
          <div className="bubble-dot"></div>
          <div className="bubble-dot"></div>
          <div className="bubble-dot"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
