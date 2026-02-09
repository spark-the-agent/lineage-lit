'use client';

import { useEffect, useRef, useState } from 'react';
import { Creator } from '@/lib/data';

interface Node {
  id: string;
  name: string;
  type: 'creator' | 'work';
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  type: 'influenced' | 'created';
}

interface LineageGraphProps {
  creators: Creator[];
  highlightedCreator?: string;
}

export default function LineageGraph({ creators, highlightedCreator }: LineageGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width } = svgRef.current.parentElement.getBoundingClientRect();
        const mobile = width < 640;
        setIsMobile(mobile);
        setDimensions({ 
          width: width - 32, 
          height: mobile ? 350 : 500 
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear existing
    svgRef.current.innerHTML = '';

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    // Build nodes and links
    const nodes: Node[] = [];
    const links: Link[] = [];
    const nodeSet = new Set<string>();

    // Add creator nodes
    creators.forEach((creator, i) => {
      if (!nodeSet.has(creator.id)) {
        const angle = (i / creators.length) * 2 * Math.PI;
        const radius = isMobile ? 80 : 150;
        nodes.push({
          id: creator.id,
          name: creator.name,
          type: 'creator',
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        });
        nodeSet.add(creator.id);
      }

      // Add works as nodes (limit on mobile)
      creator.works.slice(0, isMobile ? 2 : undefined).forEach((work, j) => {
        const workId = `work-${work.id}`;
        if (!nodeSet.has(workId)) {
          const angle = (i / creators.length) * 2 * Math.PI + (j * 0.2);
          const radius = isMobile ? 140 : 250;
          nodes.push({
            id: workId,
            name: work.title,
            type: 'work',
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          });
          nodeSet.add(workId);
        }
        // Link creator to work
        links.push({ source: creator.id, target: workId, type: 'created' });
      });

      // Add influence links
      creator.influenced.forEach(influencedId => {
        links.push({ source: creator.id, target: influencedId, type: 'influenced' });
      });
    });

    // Simple force simulation
    const simulation = () => {
      // Repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x! - nodes[i].x!;
          const dy = nodes[j].y! - nodes[i].y!;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < (isMobile ? 60 : 80) && dist > 0) {
            const force = (isMobile ? 80 : 100) / dist;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            nodes[i].x! -= fx;
            nodes[i].y! -= fy;
            nodes[j].x! += fx;
            nodes[j].y! += fy;
          }
        }
      }

      // Center gravity
      nodes.forEach(node => {
        const dx = centerX - node.x!;
        const dy = centerY - node.y!;
        node.x! += dx * 0.01;
        node.y! += dy * 0.01;
      });

      // Link attraction
      links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        if (sourceNode && targetNode) {
          const dx = targetNode.x! - sourceNode.x!;
          const dy = targetNode.y! - sourceNode.y!;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const targetDist = link.type === 'influenced' ? (isMobile ? 100 : 120) : (isMobile ? 60 : 80);
          if (dist > 0) {
            const force = (dist - targetDist) * 0.05;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            sourceNode.x! += fx;
            sourceNode.y! += fy;
            targetNode.x! -= fx;
            targetNode.y! -= fy;
          }
        }
      });
    };

    // Run simulation
    for (let i = 0; i < (isMobile ? 50 : 100); i++) {
      simulation();
    }

    // Create SVG elements
    const svg = svgRef.current;

    // Draw links
    links.forEach(link => {
      const sourceNode = nodes.find(n => n.id === link.source);
      const targetNode = nodes.find(n => n.id === link.target);
      if (sourceNode && targetNode) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(sourceNode.x));
        line.setAttribute('y1', String(sourceNode.y));
        line.setAttribute('x2', String(targetNode.x));
        line.setAttribute('y2', String(targetNode.y));
        line.setAttribute('stroke', link.type === 'influenced' ? '#f59e0b' : '#71717a');
        line.setAttribute('stroke-width', link.type === 'influenced' ? '2' : '1');
        line.setAttribute('stroke-opacity', '0.6');
        if (link.type === 'influenced') {
          line.setAttribute('stroke-dasharray', '5,5');
        }
        svg.appendChild(line);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.style.cursor = 'pointer';
      g.onclick = () => setSelectedNode(selectedNode === node.id ? null : node.id);

      const isHighlighted = highlightedCreator === node.id || selectedNode === node.id;
      const isSelected = selectedNode === node.id;

      // Circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', String(node.x));
      circle.setAttribute('cy', String(node.y));
      circle.setAttribute('r', isSelected ? (isMobile ? '20' : '25') : (isMobile ? '15' : '20'));
      circle.setAttribute('fill', node.type === 'creator' ? '#18181b' : '#27272a');
      circle.setAttribute('stroke', isHighlighted ? '#f59e0b' : node.type === 'creator' ? '#f59e0b' : '#71717a');
      circle.setAttribute('stroke-width', isHighlighted ? '3' : '2');
      g.appendChild(circle);

      // Label (only for creators on mobile, or all on desktop)
      if (!isMobile || node.type === 'creator') {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(node.x));
        text.setAttribute('y', String(node.y! + (isMobile ? 28 : 35)));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', isHighlighted ? '#fbbf24' : '#e4e4e7');
        text.setAttribute('font-size', isMobile ? '9' : '11');
        text.setAttribute('font-weight', isHighlighted ? '600' : '400');
        const displayName = node.name.length > (isMobile ? 12 : 15) 
          ? node.name.slice(0, isMobile ? 9 : 12) + '...' 
          : node.name;
        text.textContent = displayName;
        g.appendChild(text);
      }

      // Icon indicator
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      icon.setAttribute('x', String(node.x));
      icon.setAttribute('y', String(node.y! + (isMobile ? 4 : 5)));
      icon.setAttribute('text-anchor', 'middle');
      icon.setAttribute('fill', node.type === 'creator' ? '#f59e0b' : '#a1a1aa');
      icon.setAttribute('font-size', isMobile ? '12' : '16');
      icon.textContent = node.type === 'creator' ? '👤' : '📖';
      g.appendChild(icon);

      svg.appendChild(g);
    });
  }, [creators, dimensions, selectedNode, highlightedCreator, isMobile]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-zinc-400">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 border-2 border-amber-500"></div>
          <span>Creator</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-zinc-800 border-2 border-zinc-500"></div>
          <span>Work</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 sm:w-8 h-0.5 bg-amber-500 border-dashed border-t border-amber-500"></div>
          <span>Influenced</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-6 sm:w-8 h-0.5 bg-zinc-500"></div>
          <span>Created</span>
        </div>
      </div>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="bg-zinc-900/30 rounded-xl border border-zinc-800 w-full touch-pan-y"
        style={{ maxWidth: '100%' }}
      />
      {selectedNode && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <p className="text-xs sm:text-sm text-zinc-400">
            Selected: <span className="text-amber-400 font-medium">{selectedNode}</span>
          </p>
        </div>
      )}
    </div>
  );
}
