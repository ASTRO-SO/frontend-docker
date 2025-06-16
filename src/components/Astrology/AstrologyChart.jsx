import React, { useEffect, useRef } from 'react';

const AstrologyChart = ({ chartData, size = 700 }) => {
  const svgRef = useRef(null);
  
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

  useEffect(() => {
    if (!chartData || !svgRef.current) return;

    const svg = svgRef.current;
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size / 2 - 40;
    const innerRadius = outerRadius - 60;
    const planetRadius = innerRadius - 30;

    // Clear previous content
    svg.innerHTML = '';

    // Create defs for gradients
    const defs = document.createElementNS('https://www.w3.org/2000/svg', 'defs');
    
    // Create radial gradient for background
    const bgGradient = document.createElementNS('https://www.w3.org/2000/svg', 'radialGradient');
    bgGradient.setAttribute('id', 'bgGradient');
    bgGradient.setAttribute('cx', '50%');
    bgGradient.setAttribute('cy', '50%');
    bgGradient.setAttribute('r', '50%');
    
    const stop1 = document.createElementNS('https://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#1a1a2e');
    stop1.setAttribute('stop-opacity', '0.9');
    
    const stop2 = document.createElementNS('https://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#16213e');
    stop2.setAttribute('stop-opacity', '1');
    
    bgGradient.appendChild(stop1);
    bgGradient.appendChild(stop2);
    defs.appendChild(bgGradient);
    svg.appendChild(defs);

    // Background circle
    const bgCircle = document.createElementNS('https://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', centerX);
    bgCircle.setAttribute('cy', centerY);
    bgCircle.setAttribute('r', outerRadius);
    bgCircle.setAttribute('fill', 'url(#bgGradient)');
    bgCircle.setAttribute('stroke', '#FFD700');
    bgCircle.setAttribute('stroke-width', '2');
    svg.appendChild(bgCircle);

    // Draw zodiac wheel
    zodiacSigns.forEach((sign, index) => {
      const startAngle = sign.degree;
      const endAngle = sign.degree + 30;
      
      // Create zodiac section
      const path = document.createElementNS('https://www.w3.org/2000/svg', 'path');
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
      
      path.setAttribute('d', pathData);
      path.setAttribute('fill', sign.color);
      path.setAttribute('fill-opacity', '0.2');
      path.setAttribute('stroke', sign.color);
      path.setAttribute('stroke-width', '1');
      svg.appendChild(path);
      
      // Add zodiac symbol
      const symbolAngle = startAngle + 15; // Middle of the section
      const symbolPos = degreeToCoords(symbolAngle, (outerRadius + innerRadius) / 2, centerX, centerY);
      
      const symbolText = document.createElementNS('https://www.w3.org/2000/svg', 'text');
      symbolText.setAttribute('x', symbolPos.x);
      symbolText.setAttribute('y', symbolPos.y);
      symbolText.setAttribute('text-anchor', 'middle');
      symbolText.setAttribute('dominant-baseline', 'central');
      symbolText.setAttribute('font-size', '20');
      symbolText.setAttribute('font-weight', 'bold');
      symbolText.setAttribute('fill', sign.color);
      symbolText.textContent = sign.symbol;
      svg.appendChild(symbolText);
    });

    // Inner circle
    const innerCircle = document.createElementNS('https://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', centerX);
    innerCircle.setAttribute('cy', centerY);
    innerCircle.setAttribute('r', innerRadius);
    innerCircle.setAttribute('fill', 'none');
    innerCircle.setAttribute('stroke', '#FFD700');
    innerCircle.setAttribute('stroke-width', '2');
    svg.appendChild(innerCircle);

    // Planet circle
    const planetCircle = document.createElementNS('https://www.w3.org/2000/svg', 'circle');
    planetCircle.setAttribute('cx', centerX);
    planetCircle.setAttribute('cy', centerY);
    planetCircle.setAttribute('r', planetRadius);
    planetCircle.setAttribute('fill', 'none');
    planetCircle.setAttribute('stroke', '#888');
    planetCircle.setAttribute('stroke-width', '1');
    planetCircle.setAttribute('stroke-dasharray', '2,2');
    svg.appendChild(planetCircle);

    // Draw planets
    Object.entries(chartData).forEach(([planetKey, planetData]) => {
      if (!planetInfo[planetKey] || !planetData) return;
      
      const planet = planetInfo[planetKey];
      const totalDegree = signToDegree(planetData.sign, planetData.degree);
      const planetPos = degreeToCoords(totalDegree, planetRadius, centerX, centerY);
      
      // Planet circle background
      const planetBg = document.createElementNS('https://www.w3.org/2000/svg', 'circle');
      planetBg.setAttribute('cx', planetPos.x);
      planetBg.setAttribute('cy', planetPos.y);
      planetBg.setAttribute('r', '15');
      planetBg.setAttribute('fill', 'rgba(0,0,0,0.7)');
      planetBg.setAttribute('stroke', planet.color);
      planetBg.setAttribute('stroke-width', '2');
      svg.appendChild(planetBg);
      
      // Planet symbol
      const planetSymbol = document.createElementNS('https://www.w3.org/2000/svg', 'text');
      planetSymbol.setAttribute('x', planetPos.x);
      planetSymbol.setAttribute('y', planetPos.y);
      planetSymbol.setAttribute('text-anchor', 'middle');
      planetSymbol.setAttribute('dominant-baseline', 'central');
      planetSymbol.setAttribute('font-size', planetKey === 'ascendant' ? '10' : '16');
      planetSymbol.setAttribute('font-weight', 'bold');
      planetSymbol.setAttribute('fill', planet.color);
      planetSymbol.textContent = planet.symbol;
      svg.appendChild(planetSymbol);
      
      // Line from center to planet
      const line = document.createElementNS('https://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', centerX);
      line.setAttribute('y1', centerY);
      line.setAttribute('x2', planetPos.x);
      line.setAttribute('y2', planetPos.y);
      line.setAttribute('stroke', planet.color);
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-opacity', '0.5');
      svg.appendChild(line);
      
      // Add planet info on hover
      const planetGroup = document.createElementNS('https://www.w3.org/2000/svg', 'g');
      planetGroup.appendChild(planetBg);
      planetGroup.appendChild(planetSymbol);
      
      // Create tooltip
      const tooltip = document.createElementNS('https://www.w3.org/2000/svg', 'g');
      tooltip.setAttribute('opacity', '0');
      tooltip.setAttribute('pointer-events', 'none');
      
      const tooltipBg = document.createElementNS('https://www.w3.org/2000/svg', 'rect');
      tooltipBg.setAttribute('x', planetPos.x + 20);
      tooltipBg.setAttribute('y', planetPos.y - 25);
      tooltipBg.setAttribute('width', '120');
      tooltipBg.setAttribute('height', '40');
      tooltipBg.setAttribute('fill', 'rgba(0,0,0,0.9)');
      tooltipBg.setAttribute('stroke', planet.color);
      tooltipBg.setAttribute('stroke-width', '1');
      tooltipBg.setAttribute('rx', '5');
      
      const tooltipText = document.createElementNS('https://www.w3.org/2000/svg', 'text');
      tooltipText.setAttribute('x', planetPos.x + 80);
      tooltipText.setAttribute('y', planetPos.y - 10);
      tooltipText.setAttribute('text-anchor', 'middle');
      tooltipText.setAttribute('fill', 'white');
      tooltipText.setAttribute('font-size', '12');
      tooltipText.textContent = `${planet.name}`;
      
      const tooltipText2 = document.createElementNS('https://www.w3.org/2000/svg', 'text');
      tooltipText2.setAttribute('x', planetPos.x + 80);
      tooltipText2.setAttribute('y', planetPos.y + 5);
      tooltipText2.setAttribute('text-anchor', 'middle');
      tooltipText2.setAttribute('fill', planet.color);
      tooltipText2.setAttribute('font-size', '10');
      tooltipText2.textContent = `${zodiacSigns[planetData.sign - 1]?.name} ${planetData.degree}°`;
      
      tooltip.appendChild(tooltipBg);
      tooltip.appendChild(tooltipText);
      tooltip.appendChild(tooltipText2);
      
      planetGroup.addEventListener('mouseenter', () => {
        tooltip.setAttribute('opacity', '1');
      });
      
      planetGroup.addEventListener('mouseleave', () => {
        tooltip.setAttribute('opacity', '0');
      });
      
      svg.appendChild(planetGroup);
      svg.appendChild(tooltip);
    });

    // Center point
    const centerPoint = document.createElementNS('https://www.w3.org/2000/svg', 'circle');
    centerPoint.setAttribute('cx', centerX);
    centerPoint.setAttribute('cy', centerY);
    centerPoint.setAttribute('r', '5');
    centerPoint.setAttribute('fill', '#FFD700');
    svg.appendChild(centerPoint);

    // Degree markers
    for (let i = 0; i < 360; i += 30) {
      const pos = degreeToCoords(i, outerRadius - 10, centerX, centerY);
      const degreeText = document.createElementNS('https://www.w3.org/2000/svg', 'text');
      degreeText.setAttribute('x', pos.x);
      degreeText.setAttribute('y', pos.y);
      degreeText.setAttribute('text-anchor', 'middle');
      degreeText.setAttribute('dominant-baseline', 'central');
      degreeText.setAttribute('font-size', '10');
      degreeText.setAttribute('fill', '#888');
      degreeText.textContent = `${i}°`;
      svg.appendChild(degreeText);
    }

  }, [chartData, size]);

  if (!chartData) {
    return <div className="text-center text-gray-400">No chart data available</div>;
  }

  return (
    <div className="flex flex-col items-center">
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