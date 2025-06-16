import React, { useEffect, useRef, useState } from 'react';

const AstrologyChart = ({ chartData, size = 700 }) => {
  const svgRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  
  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Zodiac signs data
  const zodiacSigns = [
    { name: 'Aries', symbol: '♈', color: '#FF6B6B', degree: 0 },
    { name: 'Taurus', symbol: '♉', color: '#4ECDC4', degree: 30 },
    { name: 'Gemini', symbol: '♊', color: '#45B7D1', degree: 60 },
    { name: 'Cancer', symbol: '♋', color: '#96CEB4', degree: 90 },
    { name: 'Leo', symbol: '♌', color: '#FFEAA7', degree: 120 },
    { name: 'Virgo', symbol: '♍', color: '#DDA0DD', degree: 150 },
    { name: 'Libra', symbol: '♎', color: '#98D8C8', degree: 180 },
    { name: 'Scorpio', symbol: '♏', color: '#F7DC6F', degree: 210 },
    { name: 'Sagittarius', symbol: '♐', color: '#BB8FCE', degree: 240 },
    { name: 'Capricorn', symbol: '♑', color: '#85C1E9', degree: 270 },
    { name: 'Aquarius', symbol: '♒', color: '#F8C471', degree: 300 },
    { name: 'Pisces', symbol: '♓', color: '#82E0AA', degree: 330 }
  ];

  // Planet symbols and colors
  const planetInfo = {
    sun: { symbol: '☉', color: '#FFD700', name: 'Sun' },
    moon: { symbol: '☽', color: '#C0C0C0', name: 'Moon' },
    mercury: { symbol: '☿', color: '#FFA500', name: 'Mercury' },
    venus: { symbol: '♀', color: '#FF69B4', name: 'Venus' },
    mars: { symbol: '♂', color: '#FF4500', name: 'Mars' },
    jupiter: { symbol: '♃', color: '#4169E1', name: 'Jupiter' },
    saturn: { symbol: '♄', color: '#8B4513', name: 'Saturn' },
    neptune: { symbol: '♆', color: '#4682B4', name: 'Neptune' },
    pluto: { symbol: '♇', color: '#8B0000', name: 'Pluto' },
    chiron: { symbol: '⚷', color: '#9ACD32', name: 'Chiron' },
    ascendant: { symbol: 'AC', color: '#FF1493', name: 'Ascendant' }
  };

  // Convert zodiac sign number to degree position
  const signToDegree = (sign, degree) => {
    return ((sign - 1) * 30) + degree;
  };

  // Convert degree to SVG coordinates
  const degreeToCoords = (degree, radius, centerX, centerY) => {
    const radian = (degree - 90) * (Math.PI / 180); // -90 to start from top
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian)
    };
  };

  // Create SVG element helper
  const createSVGElement = (tagName, attributes = {}) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  };

  useEffect(() => {
    if (!chartData || !svgRef.current || !isClient) return;

    const svg = svgRef.current;
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size / 2 - 40;
    const innerRadius = outerRadius - 60;
    const planetRadius = innerRadius - 30;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Create defs for gradients
    const defs = createSVGElement('defs');
    
    // Create radial gradient for background
    const bgGradient = createSVGElement('radialGradient', {
      id: 'bgGradient',
      cx: '50%',
      cy: '50%',
      r: '50%'
    });
    
    const stop1 = createSVGElement('stop', {
      offset: '0%',
      'stop-color': '#1a1a2e',
      'stop-opacity': '0.9'
    });
    
    const stop2 = createSVGElement('stop', {
      offset: '100%',
      'stop-color': '#16213e',
      'stop-opacity': '1'
    });
    
    bgGradient.appendChild(stop1);
    bgGradient.appendChild(stop2);
    defs.appendChild(bgGradient);
    svg.appendChild(defs);

    // Background circle
    const bgCircle = createSVGElement('circle', {
      cx: centerX,
      cy: centerY,
      r: outerRadius,
      fill: 'url(#bgGradient)',
      stroke: '#FFD700',
      'stroke-width': '2'
    });
    svg.appendChild(bgCircle);

    // Draw zodiac wheel
    zodiacSigns.forEach((sign, index) => {
      const startAngle = sign.degree;
      const endAngle = sign.degree + 30;
      
      // Create zodiac section
      const startOuter = degreeToCoords(startAngle, outerRadius, centerX, centerY);
      const endOuter = degreeToCoords(endAngle, outerRadius, centerX, centerY);
      const startInner = degreeToCoords(startAngle, innerRadius, centerX, centerY);
      const endInner = degreeToCoords(endAngle, innerRadius, centerX, centerY);
      
      const pathData = [
        `M ${startInner.x} ${startInner.y}`,
        `L ${startOuter.x} ${startOuter.y}`,
        `A ${outerRadius} ${outerRadius} 0 0 1 ${endOuter.x} ${endOuter.y}`,
        `L ${endInner.x} ${endInner.y}`,
        `A ${innerRadius} ${innerRadius} 0 0 0 ${startInner.x} ${startInner.y}`,
        'Z'
      ].join(' ');
      
      const path = createSVGElement('path', {
        d: pathData,
        fill: sign.color,
        'fill-opacity': '0.2',
        stroke: sign.color,
        'stroke-width': '1'
      });
      svg.appendChild(path);
      
      // Add zodiac symbol
      const symbolAngle = startAngle + 15; // Middle of the section
      const symbolPos = degreeToCoords(symbolAngle, (outerRadius + innerRadius) / 2, centerX, centerY);
      
      const symbolText = createSVGElement('text', {
        x: symbolPos.x,
        y: symbolPos.y,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'font-size': '20',
        'font-weight': 'bold',
        fill: sign.color
      });
      symbolText.textContent = sign.symbol;
      svg.appendChild(symbolText);
    });

    // Inner circle
    const innerCircle = createSVGElement('circle', {
      cx: centerX,
      cy: centerY,
      r: innerRadius,
      fill: 'none',
      stroke: '#FFD700',
      'stroke-width': '2'
    });
    svg.appendChild(innerCircle);

    // Planet circle
    const planetCircle = createSVGElement('circle', {
      cx: centerX,
      cy: centerY,
      r: planetRadius,
      fill: 'none',
      stroke: '#888',
      'stroke-width': '1',
      'stroke-dasharray': '2,2'
    });
    svg.appendChild(planetCircle);

    // Draw planets
    if (chartData && typeof chartData === 'object') {
      Object.entries(chartData).forEach(([planetKey, planetData]) => {
        if (!planetInfo[planetKey] || !planetData) return;
        
        const planet = planetInfo[planetKey];
        const totalDegree = signToDegree(planetData.sign, planetData.degree);
        const planetPos = degreeToCoords(totalDegree, planetRadius, centerX, centerY);
        
        // Planet circle background
        const planetBg = createSVGElement('circle', {
          cx: planetPos.x,
          cy: planetPos.y,
          r: '15',
          fill: 'rgba(0,0,0,0.7)',
          stroke: planet.color,
          'stroke-width': '2'
        });
        svg.appendChild(planetBg);
        
        // Planet symbol
        const planetSymbol = createSVGElement('text', {
          x: planetPos.x,
          y: planetPos.y,
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'font-size': planetKey === 'ascendant' ? '10' : '16',
          'font-weight': 'bold',
          fill: planet.color
        });
        planetSymbol.textContent = planet.symbol;
        svg.appendChild(planetSymbol);
        
        // Line from center to planet
        const line = createSVGElement('line', {
          x1: centerX,
          y1: centerY,
          x2: planetPos.x,
          y2: planetPos.y,
          stroke: planet.color,
          'stroke-width': '1',
          'stroke-opacity': '0.5'
        });
        svg.appendChild(line);
        
        // Create planet group for hover effects
        const planetGroup = createSVGElement('g');
        planetGroup.appendChild(planetBg.cloneNode(true));
        planetGroup.appendChild(planetSymbol.cloneNode(true));
        
        // Create tooltip
        const tooltip = createSVGElement('g', {
          opacity: '0',
          'pointer-events': 'none'
        });
        
        const tooltipBg = createSVGElement('rect', {
          x: planetPos.x + 20,
          y: planetPos.y - 25,
          width: '120',
          height: '40',
          fill: 'rgba(0,0,0,0.9)',
          stroke: planet.color,
          'stroke-width': '1',
          rx: '5'
        });
        
        const tooltipText = createSVGElement('text', {
          x: planetPos.x + 80,
          y: planetPos.y - 10,
          'text-anchor': 'middle',
          fill: 'white',
          'font-size': '12'
        });
        tooltipText.textContent = planet.name;
        
        const tooltipText2 = createSVGElement('text', {
          x: planetPos.x + 80,
          y: planetPos.y + 5,
          'text-anchor': 'middle',
          fill: planet.color,
          'font-size': '10'
        });
        tooltipText2.textContent = `${zodiacSigns[planetData.sign - 1]?.name} ${planetData.degree}°`;
        
        tooltip.appendChild(tooltipBg);
        tooltip.appendChild(tooltipText);
        tooltip.appendChild(tooltipText2);
        
        // Add event listeners
        planetGroup.addEventListener('mouseenter', () => {
          tooltip.setAttribute('opacity', '1');
        });
        
        planetGroup.addEventListener('mouseleave', () => {
          tooltip.setAttribute('opacity', '0');
        });
        
        svg.appendChild(planetGroup);
        svg.appendChild(tooltip);
      });
    }

    // Center point
    const centerPoint = createSVGElement('circle', {
      cx: centerX,
      cy: centerY,
      r: '5',
      fill: '#FFD700'
    });
    svg.appendChild(centerPoint);

    // Degree markers
    for (let i = 0; i < 360; i += 30) {
      const pos = degreeToCoords(i, outerRadius - 10, centerX, centerY);
      const degreeText = createSVGElement('text', {
        x: pos.x,
        y: pos.y,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'font-size': '10',
        fill: '#888'
      });
      degreeText.textContent = `${i}°`;
      svg.appendChild(degreeText);
    }

  }, [chartData, size, isClient]);

  // Loading state for server-side rendering
  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-center text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-2"></div>
          <p>Loading chart...</p>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-center text-gray-400">
          <p>No chart data available</p>
          <p className="text-sm mt-2">Expected format:</p>
          <pre className="text-xs mt-2 bg-gray-800 p-2 rounded">
{`{
  sun: { sign: 1, degree: 15 },
  moon: { sign: 3, degree: 22 },
  // ... other planets
}`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-900 p-4 rounded-lg">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        className="drop-shadow-2xl"
        style={{ background: 'transparent' }}
      />
      <div className="mt-4 text-center">
        <h3 className="text-yellow-400 font-bold text-lg mb-2">Bản Đồ Sao Cá Nhân</h3>
        <p className="text-gray-300 text-sm">Di chuột qua các hành tinh để xem chi tiết</p>
      </div>
    </div>
  );
};

export default AstrologyChart;