import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import arthurAvatar from '@/assets/ai-salesman-avatar.jpg';

interface CircuitNode {
  id: number;
  x: number;
  y: number;
  active: boolean;
  type: 'junction' | 'processor' | 'memory';
}

interface CircuitPath {
  id: number;
  points: { x: number; y: number }[];
  active: boolean;
}

function CircuitBrain() {
  const [nodes, setNodes] = useState<CircuitNode[]>([]);
  const [paths, setPaths] = useState<CircuitPath[]>([]);
  const [activeNodes, setActiveNodes] = useState(new Set<number>());

  useEffect(() => {
    // Create brain outline points and internal circuit structure
    const brainNodes: CircuitNode[] = [];
    const brainPaths: CircuitPath[] = [];
    
    // Main processing areas
    const processingAreas = [
      { x: 180, y: 120, area: 'frontal' },
      { x: 120, y: 160, area: 'temporal' },
      { x: 280, y: 160, area: 'parietal' },
      { x: 200, y: 200, area: 'occipital' }
    ];

    // Create circuit nodes in brain regions
    processingAreas.forEach((area, areaIndex) => {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 30 + Math.random() * 20;
        brainNodes.push({
          id: areaIndex * 8 + i,
          x: area.x + Math.cos(angle) * radius,
          y: area.y + Math.sin(angle) * radius,
          active: false,
          type: i % 3 === 0 ? 'processor' : i % 3 === 1 ? 'memory' : 'junction'
        });
      }
    });

    // Create interconnecting paths
    for (let i = 0; i < brainNodes.length - 1; i++) {
      const startNode = brainNodes[i];
      const endNode = brainNodes[i + 1];
      
      // Create L-shaped or curved paths
      const midX = startNode.x + (endNode.x - startNode.x) * 0.5;
      const midY = startNode.y;
      
      brainPaths.push({
        id: i,
        points: [
          { x: startNode.x, y: startNode.y },
          { x: midX, y: midY },
          { x: midX, y: endNode.y },
          { x: endNode.x, y: endNode.y }
        ],
        active: false
      });
    }

    setNodes(brainNodes);
    setPaths(brainPaths);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate neural activity with wave patterns
      const activeSet = new Set<number>();
      const time = Date.now() / 1000;
      
      nodes.forEach((node, index) => {
        const wave = Math.sin(time * 2 + index * 0.3) * 0.5 + 0.5;
        if (wave > 0.6) {
          activeSet.add(index);
        }
      });
      
      setActiveNodes(activeSet);
      
      // Update paths activity based on connected nodes
      setPaths(prevPaths => 
        prevPaths.map(path => ({
          ...path,
          active: activeSet.has(path.id) || activeSet.has(path.id + 1)
        }))
      );
      
      setNodes(prevNodes =>
        prevNodes.map((node, index) => ({
          ...node,
          active: activeSet.has(index)
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, [nodes.length]);

  return (
    <div className="relative w-full h-96 bg-white">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 400 300"
        className="absolute inset-0"
      >
        {/* Brain outline */}
        <path
          d="M 80,150 
             C 80,80 120,60 200,60
             C 280,60 320,80 320,150
             C 320,180 300,200 280,210
             C 260,220 240,230 200,230
             C 160,230 140,220 120,210
             C 100,200 80,180 80,150 Z"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          opacity="0.3"
        />
        
        {/* Circuit paths */}
        {paths.map((path) => (
          <g key={`path-${path.id}`}>
            <polyline
              points={path.points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={path.active ? "#8b5cf6" : "#9ca3af"}
              strokeWidth={path.active ? "2" : "1"}
              opacity={path.active ? "0.8" : "0.4"}
              className={path.active ? "animate-pulse" : ""}
            />
            {path.active && (
              <polyline
                points={path.points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#a855f7"
                strokeWidth="4"
                opacity="0.3"
              />
            )}
          </g>
        ))}
        
        {/* Circuit nodes */}
        {nodes.map((node) => (
          <g key={`node-${node.id}`}>
            {node.active && (
              <circle
                cx={node.x}
                cy={node.y}
                r={node.type === 'processor' ? "8" : node.type === 'memory' ? "6" : "4"}
                fill="#a855f7"
                opacity="0.4"
                className="animate-ping"
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.type === 'processor' ? "4" : node.type === 'memory' ? "3" : "2"}
              fill={node.active ? "#8b5cf6" : "#6b7280"}
              className={node.active ? "animate-pulse" : ""}
            />
            {node.type === 'processor' && (
              <rect
                x={node.x - 2}
                y={node.y - 2}
                width="4"
                height="4"
                fill={node.active ? "#ffffff" : "#d1d5db"}
                opacity="0.8"
              />
            )}
          </g>
        ))}
        
        {/* Labels */}
        <text x="60" y="100" fontSize="12" fill="#6b7280" className="font-medium">
          INTELLIGENCE
        </text>
        <text x="320" y="120" fontSize="12" fill="#6b7280" className="font-medium">
          CREATIVE
        </text>
        <text x="160" y="50" fontSize="12" fill="#6b7280" className="font-medium">
          HUMAN
        </text>
        <text x="300" y="180" fontSize="12" fill="#6b7280" className="font-medium">
          IDEA
        </text>
        <text x="140" y="250" fontSize="12" fill="#6b7280" className="font-medium">
          BRAIN
        </text>
      </svg>
    </div>
  );
}

export function NeuralBrainVisualization() {
  const [learningStats, setLearningStats] = useState({
    messagesProcessed: 0,
    stylesLearned: 0,
    accuracyImprovement: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLearningStats(prev => ({
        messagesProcessed: Math.min(prev.messagesProcessed + Math.random() * 2, 150),
        stylesLearned: Math.min(prev.stylesLearned + Math.random() * 0.5, 12),
        accuracyImprovement: Math.min(prev.accuracyImprovement + Math.random() * 0.3, 25)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Neural Brain Visualization</h2>
        <p className="text-muted-foreground">
          Watch Arthur's AI brain learn and adapt to your preferences in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <CardTitle>Arthur's Neural Network</CardTitle>
                <div className="relative">
                  <img 
                    src={arthurAvatar} 
                    alt="Arthur AI Avatar" 
                    className="w-16 h-16 rounded-full border-2 border-primary/20"
                  />
                  <div className="absolute -top-2 -left-32 bg-white border border-gray-200 rounded-lg p-3 shadow-lg max-w-xs animate-fade-in">
                    <div className="text-sm text-gray-700">
                      "Watch my neural pathways light up as I learn your unique writing style!"
                    </div>
                    <div className="absolute top-4 right-0 w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent transform translate-x-full"></div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CircuitBrain />
              <div className="mt-4 text-sm text-muted-foreground text-center">
                <p className="animate-fade-in">Circuit pathways processing neural signals • Real-time AI learning visualization</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Learning Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Messages Processed</span>
                  <span>{Math.round(learningStats.messagesProcessed)}</span>
                </div>
                <Progress value={(learningStats.messagesProcessed / 150) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Writing Styles Learned</span>
                  <span>{Math.round(learningStats.stylesLearned)}</span>
                </div>
                <Progress value={(learningStats.stylesLearned / 12) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Accuracy Improvement</span>
                  <span>+{Math.round(learningStats.accuracyImprovement)}%</span>
                </div>
                <Progress value={(learningStats.accuracyImprovement / 25) * 100} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/30">
                  Learning
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Neural Activity</span>
                <Badge variant="secondary">
                  High
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Training</span>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Arthur is currently analyzing your message patterns and adapting to your preferred communication style.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}