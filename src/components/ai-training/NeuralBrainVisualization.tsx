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
  region: 'cortex' | 'hippocampus' | 'amygdala' | 'frontal';
}

function Neuron({ position, active, intensity, region }: NeuronProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const dendriteRefs = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && active) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.2 * intensity);
    }
    if (dendriteRefs.current) {
      dendriteRefs.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const getRegionColor = () => {
    switch (region) {
      case 'cortex': return active ? '#3b82f6' : '#1e293b';
      case 'hippocampus': return active ? '#10b981' : '#064e3b';
      case 'amygdala': return active ? '#f59e0b' : '#451a03';
      case 'frontal': return active ? '#8b5cf6' : '#2e1065';
      default: return active ? '#3b82f6' : '#1e293b';
    }
  };

  const createDendrites = () => {
    const dendrites = [];
    const numDendrites = 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numDendrites; i++) {
      const angle = (Math.PI * 2 * i) / numDendrites;
      const length = 0.2 + Math.random() * 0.3;
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(
          Math.cos(angle) * length * 0.5,
          Math.sin(angle) * length * 0.5,
          (Math.random() - 0.5) * 0.2
        ),
        new THREE.Vector3(
          Math.cos(angle) * length,
          Math.sin(angle) * length,
          (Math.random() - 0.5) * 0.4
        )
      );
      
      const points = curve.getPoints(10);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      dendrites.push(
        <primitive
          key={i}
          object={new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
              color: getRegionColor(),
              opacity: active ? 0.6 : 0.2,
              transparent: true,
            })
          )}
        />
      );
    }
    return dendrites;
  };

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08 + intensity * 0.04, 12, 12]} />
        <meshStandardMaterial 
          color={getRegionColor()}
          emissive={active ? getRegionColor() : '#000000'}
          emissiveIntensity={active ? 0.3 : 0}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      <group ref={dendriteRefs}>
        {createDendrites()}
      </group>
    </group>
  );
}

interface SynapseProps {
  start: [number, number, number];
  end: [number, number, number];
  active: boolean;
  pulse: number;
  strength: number;
}

function Synapse({ start, end, active, pulse, strength }: SynapseProps) {
  const lineRef = useRef<THREE.Line>(null);
  
  useFrame(() => {
    if (lineRef.current && active) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.2 + Math.sin(pulse * 6) * 0.4 * strength;
    }
  });

  // Create curved connection using spline
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const midPoint = startVec.clone().lerp(endVec, 0.5);
  
  // Add some randomness to make it more organic
  midPoint.add(
    new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    )
  );
  
  const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
  const points = curve.getPoints(20);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive 
      ref={lineRef}
      object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: active ? 0x60a5fa : 0x334155,
        opacity: active ? 0.6 : 0.15,
        transparent: true,
        linewidth: strength * 2
      }))} 
    />
  );
}

function BrainStructure() {
  const brainRef = useRef<THREE.Group>(null);
  const [activeNeurons, setActiveNeurons] = useState(new Set<number>());
  const [activeSynapses, setActiveSynapses] = useState(new Set<number>());
  
  // Create brain-like hemisphere structure
  const createBrainRegions = () => {
    const regions = {
      leftCortex: [],
      rightCortex: [],
      hippocampus: [],
      amygdala: [],
      frontalLobe: []
    };

    // Left hemisphere cortex (more analytical)
    for (let i = 0; i < 25; i++) {
      const theta = Math.random() * Math.PI;
      const phi = Math.random() * Math.PI;
      const r = 1.2 + Math.random() * 0.4;
      
      regions.leftCortex.push([
        -Math.abs(r * Math.sin(theta) * Math.cos(phi)), // Ensure left side
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(theta)
      ] as [number, number, number]);
    }

    // Right hemisphere cortex (more creative)
    for (let i = 0; i < 25; i++) {
      const theta = Math.random() * Math.PI;
      const phi = Math.random() * Math.PI;
      const r = 1.2 + Math.random() * 0.4;
      
      regions.rightCortex.push([
        Math.abs(r * Math.sin(theta) * Math.cos(phi)), // Ensure right side
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(theta)
      ] as [number, number, number]);
    }

    // Hippocampus (memory formation)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      regions.hippocampus.push([
        Math.cos(angle) * 0.3,
        -0.5 + Math.sin(angle) * 0.2,
        -0.8 + Math.random() * 0.2
      ] as [number, number, number]);
    }

    // Amygdala (emotion processing)
    for (let i = 0; i < 6; i++) {
      const side = i < 3 ? -1 : 1;
      regions.amygdala.push([
        side * (0.4 + Math.random() * 0.2),
        -0.3 + Math.random() * 0.2,
        -0.5 + Math.random() * 0.3
      ] as [number, number, number]);
    }

    // Frontal lobe (decision making)
    for (let i = 0; i < 15; i++) {
      regions.frontalLobe.push([
        (Math.random() - 0.5) * 1.5,
        0.8 + Math.random() * 0.5,
        0.2 + Math.random() * 0.6
      ] as [number, number, number]);
    }

    return regions;
  };

  const brainRegions = createBrainRegions();
  const allNeurons = [
    ...brainRegions.leftCortex.map((pos, i) => ({ pos, region: 'cortex' as const, id: i })),
    ...brainRegions.rightCortex.map((pos, i) => ({ pos, region: 'cortex' as const, id: i + 25 })),
    ...brainRegions.hippocampus.map((pos, i) => ({ pos, region: 'hippocampus' as const, id: i + 50 })),
    ...brainRegions.amygdala.map((pos, i) => ({ pos, region: 'amygdala' as const, id: i + 58 })),
    ...brainRegions.frontalLobe.map((pos, i) => ({ pos, region: 'frontal' as const, id: i + 64 }))
  ];

  // Create synaptic connections
  const synapses = [];
  for (let i = 0; i < allNeurons.length; i++) {
    for (let j = i + 1; j < allNeurons.length; j++) {
      const neuron1 = allNeurons[i];
      const neuron2 = allNeurons[j];
      const distance = Math.sqrt(
        Math.pow(neuron1.pos[0] - neuron2.pos[0], 2) +
        Math.pow(neuron1.pos[1] - neuron2.pos[1], 2) +
        Math.pow(neuron1.pos[2] - neuron2.pos[2], 2)
      );
      
      // Connect nearby neurons with higher probability
      if (distance < 0.8 && Math.random() > 0.85) {
        synapses.push({
          start: neuron1.pos,
          end: neuron2.pos,
          strength: 1 - distance / 0.8,
          id: synapses.length
        });
      }
    }
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Simulate neural firing patterns
    const firingWaves = [
      Math.sin(time * 0.8) * 0.5 + 0.5, // Slow wave
      Math.sin(time * 2.1) * 0.5 + 0.5, // Medium wave
      Math.sin(time * 3.7) * 0.5 + 0.5  // Fast wave
    ];

    const activeSet = new Set<number>();
    const synapseSet = new Set<number>();
    
    allNeurons.forEach((neuron, index) => {
      // Different regions fire at different frequencies
      let firingProbability = 0;
      switch (neuron.region) {
        case 'cortex':
          firingProbability = firingWaves[0] * 0.6 + firingWaves[1] * 0.3;
          break;
        case 'hippocampus':
          firingProbability = firingWaves[2] * 0.8;
          break;
        case 'amygdala':
          firingProbability = firingWaves[1] * 0.9;
          break;
        case 'frontal':
          firingProbability = firingWaves[0] * 0.7 + firingWaves[2] * 0.2;
          break;
      }
      
      const neuronPhase = (index / allNeurons.length + time * 0.1) % 1;
      if (neuronPhase < firingProbability * 0.3) {
        activeSet.add(index);
      }
    });
    
    // Activate synapses based on connected neurons
    synapses.forEach((synapse, index) => {
      const startNeuron = allNeurons.find(n => 
        n.pos[0] === synapse.start[0] && 
        n.pos[1] === synapse.start[1] && 
        n.pos[2] === synapse.start[2]
      );
      const endNeuron = allNeurons.find(n => 
        n.pos[0] === synapse.end[0] && 
        n.pos[1] === synapse.end[1] && 
        n.pos[2] === synapse.end[2]
      );
      
      if (startNeuron && endNeuron && 
          (activeSet.has(startNeuron.id) || activeSet.has(endNeuron.id))) {
        synapseSet.add(index);
      }
    });
    
    setActiveNeurons(activeSet);
    setActiveSynapses(synapseSet);
    
    // Gentle brain rotation
    if (brainRef.current) {
      brainRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
      brainRef.current.rotation.x = Math.sin(time * 0.07) * 0.05;
    }
  });

  return (
    <group ref={brainRef}>
      {/* Neurons */}
      {allNeurons.map((neuron, index) => (
        <Neuron
          key={index}
          position={neuron.pos}
          active={activeNeurons.has(neuron.id)}
          intensity={activeNeurons.has(neuron.id) ? Math.random() * 0.8 + 0.2 : 0}
          region={neuron.region}
        />
      ))}
      
      {/* Synapses */}
      {synapses.map((synapse, index) => (
        <Synapse
          key={index}
          start={synapse.start}
          end={synapse.end}
          active={activeSynapses.has(index)}
          pulse={Date.now() * 0.001 + index * 0.1}
          strength={synapse.strength}
        />
      ))}
      
      {/* Brain hemispheres outline */}
      <mesh position={[-0.6, 0, 0]}>
        <sphereGeometry args={[1.6, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.05} 
          wireframe
        />
      </mesh>
      <mesh position={[0.6, 0, 0]}>
        <sphereGeometry args={[1.6, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.05} 
          wireframe
        />
      </mesh>
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
                <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
                  <ambientLight intensity={0.3} />
                  <pointLight position={[5, 5, 5]} intensity={0.8} color="#60a5fa" />
                  <pointLight position={[-5, -5, 5]} intensity={0.6} color="#8b5cf6" />
                  <spotLight 
                    position={[0, 10, 0]} 
                    angle={0.3} 
                    intensity={0.5} 
                    color="#10b981"
                    castShadow
                  />
                  <BrainStructure />
                  <OrbitControls 
                    enablePan={false} 
                    minDistance={3} 
                    maxDistance={8}
                    autoRotate
                    autoRotateSpeed={0.2}
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