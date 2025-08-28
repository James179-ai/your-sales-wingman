import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import * as THREE from 'three';

interface NeuronProps {
  position: [number, number, number];
  active: boolean;
  intensity: number;
}

function Neuron({ position, active, intensity }: NeuronProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && active) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1 * intensity);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial 
        color={active ? `hsl(${210 + intensity * 50}, 100%, ${50 + intensity * 30}%)` : 'hsl(var(--muted-foreground))'}
        emissive={active ? `hsl(${210 + intensity * 50}, 80%, 20%)` : 'hsl(0, 0%, 0%)'}
      />
    </mesh>
  );
}

interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  active: boolean;
  pulse: number;
}

function Connection({ start, end, active, pulse }: ConnectionProps) {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  
  useFrame(() => {
    if (materialRef.current && active) {
      materialRef.current.opacity = 0.3 + Math.sin(pulse * 4) * 0.3;
    }
  });

  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
      color: active ? 0x3b82f6 : 0x6b7280,
      opacity: active ? 0.6 : 0.2,
      transparent: true
    }))} />
  );
}

function NeuralNetwork() {
  const [learningProgress, setLearningProgress] = useState(0);
  const [activeNeurons, setActiveNeurons] = useState(new Set<number>());
  const [activeConnections, setActiveConnections] = useState(new Set<number>());
  
  const neurons = [
    // Input layer
    [-2, 1, 0], [-2, 0, 0], [-2, -1, 0],
    // Hidden layer 1
    [-0.5, 1.5, 0], [-0.5, 0.5, 0], [-0.5, -0.5, 0], [-0.5, -1.5, 0],
    // Hidden layer 2
    [1, 1, 0], [1, 0, 0], [1, -1, 0],
    // Output layer
    [2.5, 0.5, 0], [2.5, -0.5, 0]
  ].map(pos => pos as [number, number, number]);

  const connections = [
    // Input to hidden 1
    [0, 3], [0, 4], [1, 4], [1, 5], [2, 5], [2, 6],
    // Hidden 1 to hidden 2
    [3, 7], [4, 7], [4, 8], [5, 8], [5, 9], [6, 9],
    // Hidden 2 to output
    [7, 10], [8, 10], [8, 11], [9, 11]
  ];

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Simulate learning waves
    const waveFreq = 0.5;
    const wave = (Math.sin(time * waveFreq) + 1) / 2;
    
    // Activate neurons in waves
    const activeSet = new Set<number>();
    const connectionSet = new Set<number>();
    
    neurons.forEach((_, index) => {
      const neuronPhase = (index / neurons.length + wave) % 1;
      if (neuronPhase > 0.3 && neuronPhase < 0.9) {
        activeSet.add(index);
      }
    });
    
    connections.forEach((connection, index) => {
      const [start, end] = connection;
      if (activeSet.has(start) || activeSet.has(end)) {
        connectionSet.add(index);
      }
    });
    
    setActiveNeurons(activeSet);
    setActiveConnections(connectionSet);
    setLearningProgress((wave * 100));
  });

  return (
    <group>
      {neurons.map((position, index) => (
        <Neuron
          key={index}
          position={position}
          active={activeNeurons.has(index)}
          intensity={activeNeurons.has(index) ? Math.random() * 0.5 + 0.5 : 0}
        />
      ))}
      
      {connections.map((connection, index) => {
        const [startIdx, endIdx] = connection;
        return (
          <Connection
            key={index}
            start={neurons[startIdx]}
            end={neurons[endIdx]}
            active={activeConnections.has(index)}
            pulse={Date.now() * 0.001}
          />
        );
      })}
    </group>
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
            <CardHeader>
              <CardTitle>Arthur's Neural Network</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <NeuralNetwork />
                  <OrbitControls 
                    enablePan={false} 
                    minDistance={3} 
                    maxDistance={8}
                    autoRotate
                    autoRotateSpeed={0.5}
                  />
                </Canvas>
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-center">
                <p>Interactive 3D visualization • Click and drag to rotate • Scroll to zoom</p>
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