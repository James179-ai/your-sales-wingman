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
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && active) {
      const pulseFactor = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.3 * intensity;
      meshRef.current.scale.setScalar(pulseFactor);
      
      if (glowRef.current) {
        glowRef.current.scale.setScalar(pulseFactor * 2);
      }
    }
  });

  return (
    <group position={position}>
      {/* Main neuron node */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial 
          color={active ? '#00ffff' : '#004466'}
          transparent
          opacity={active ? 1 : 0.3}
        />
      </mesh>
      
      {/* Outer glow effect */}
      {active && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial 
            color="#00ffff"
            transparent
            opacity={0.2 * intensity}
          />
        </mesh>
      )}
      
      {/* Bright core for active neurons */}
      {active && (
        <mesh>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
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
  const glowLineRef = useRef<THREE.Line>(null);
  
  useFrame(() => {
    if (lineRef.current && active) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      const pulseBrightness = 0.6 + Math.sin(pulse * 8) * 0.4;
      material.opacity = pulseBrightness * strength;
      
      if (glowLineRef.current) {
        const glowMaterial = glowLineRef.current.material as THREE.LineBasicMaterial;
        glowMaterial.opacity = pulseBrightness * 0.3;
      }
    }
  });

  // Create curved connection using spline
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const midPoint = startVec.clone().lerp(endVec, 0.5);
  
  // Add slight curve for more organic look
  const perpendicular = new THREE.Vector3()
    .crossVectors(
      startVec.clone().sub(endVec).normalize(),
      new THREE.Vector3(0, 0, 1)
    )
    .multiplyScalar((Math.random() - 0.5) * 0.3);
  
  midPoint.add(perpendicular);
  
  const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
  const points = curve.getPoints(30);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      {/* Main synapse line */}
      <primitive 
        ref={lineRef}
        object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
          color: active ? 0x00ffff : 0x002244,
          opacity: active ? 0.8 : 0.1,
          transparent: true
        }))} 
      />
      
      {/* Glow effect for active synapses */}
      {active && (
        <primitive 
          ref={glowLineRef}
          object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: 0x66ffff,
            opacity: 0.4,
            transparent: true
          }))} 
        />
      )}
    </group>
  );
}

function BrainStructure() {
  const brainRef = useRef<THREE.Group>(null);
  const [activeNeurons, setActiveNeurons] = useState(new Set<number>());
  const [activeSynapses, setActiveSynapses] = useState(new Set<number>());
  
  // Create anatomically accurate brain structure
  const createBrainStructure = () => {
    const regions = {
      leftCortex: [],
      rightCortex: [],
      hippocampus: [],
      brainstem: [],
      cerebellum: [],
      corpus: []
    };

    // Left hemisphere - outer cortex layer
    for (let i = 0; i < 30; i++) {
      // Use spherical coordinates for realistic brain shape
      const theta = Math.random() * Math.PI * 0.85; // Limit to upper portion
      const phi = Math.random() * Math.PI; // Half sphere
      const r = 1.3 + Math.random() * 0.2;
      
      const x = -Math.abs(r * Math.sin(theta) * Math.cos(phi)) - 0.1;
      const y = r * Math.sin(theta) * Math.sin(phi) * 0.9;
      const z = r * Math.cos(theta) * 0.7;
      
      regions.leftCortex.push([x, y, z] as [number, number, number]);
    }

    // Right hemisphere - outer cortex layer
    for (let i = 0; i < 30; i++) {
      const theta = Math.random() * Math.PI * 0.85;
      const phi = Math.random() * Math.PI;
      const r = 1.3 + Math.random() * 0.2;
      
      const x = Math.abs(r * Math.sin(theta) * Math.cos(phi)) + 0.1;
      const y = r * Math.sin(theta) * Math.sin(phi) * 0.9;
      const z = r * Math.cos(theta) * 0.7;
      
      regions.rightCortex.push([x, y, z] as [number, number, number]);
    }

    // Corpus callosum - bridge between hemispheres
    for (let i = 0; i < 8; i++) {
      const t = (i / 7) * 0.6 - 0.3;
      regions.corpus.push([
        t,
        0.3 + Math.sin(i) * 0.1,
        0.2 + Math.cos(i) * 0.1
      ] as [number, number, number]);
    }

    // Hippocampus - deeper brain structure
    for (let i = 0; i < 10; i++) {
      const side = i < 5 ? -1 : 1;
      const offset = (i % 5) * 0.1;
      regions.hippocampus.push([
        side * (0.6 + offset),
        -0.2 + Math.sin(i) * 0.1,
        -0.3 + Math.cos(i) * 0.2
      ] as [number, number, number]);
    }

    // Brain stem - central column
    for (let i = 0; i < 8; i++) {
      const y = -0.8 - i * 0.15;
      regions.brainstem.push([
        (Math.random() - 0.5) * 0.2,
        y,
        -0.4 + Math.random() * 0.2
      ] as [number, number, number]);
    }

    // Cerebellum - back of brain, folded structure
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const r = 0.4 + Math.random() * 0.15;
      regions.cerebellum.push([
        Math.cos(angle) * r * 0.8,
        -0.4 + Math.sin(angle) * 0.2,
        -1.0 + Math.random() * 0.2
      ] as [number, number, number]);
    }

    return regions;
  };

  const brainRegions = createBrainStructure();
  const allNeurons = [
    ...brainRegions.leftCortex.map((pos, i) => ({ pos, region: 'cortex' as const, id: i })),
    ...brainRegions.rightCortex.map((pos, i) => ({ pos, region: 'cortex' as const, id: i + 30 })),
    ...brainRegions.corpus.map((pos, i) => ({ pos, region: 'frontal' as const, id: i + 60 })),
    ...brainRegions.hippocampus.map((pos, i) => ({ pos, region: 'hippocampus' as const, id: i + 68 })),
    ...brainRegions.brainstem.map((pos, i) => ({ pos, region: 'amygdala' as const, id: i + 78 })),
    ...brainRegions.cerebellum.map((pos, i) => ({ pos, region: 'amygdala' as const, id: i + 86 }))
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
      
      {/* Brain hemisphere wireframes */}
      <mesh position={[-0.3, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 24, 16, 0, Math.PI]} />
        <meshBasicMaterial 
          color="#003366" 
          transparent 
          opacity={0.08} 
          wireframe
        />
      </mesh>
      <mesh position={[0.3, 0, 0]} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[1.5, 24, 16, 0, Math.PI]} />
        <meshBasicMaterial 
          color="#003366" 
          transparent 
          opacity={0.08} 
          wireframe
        />
      </mesh>
      
      {/* Cerebellum */}
      <mesh position={[0, -0.4, -1.0]}>
        <sphereGeometry args={[0.6, 16, 12]} />
        <meshBasicMaterial 
          color="#002244" 
          transparent 
          opacity={0.15} 
          wireframe
        />
      </mesh>
      
      {/* Brain stem */}
      <mesh position={[0, -1.4, -0.4]}>
        <cylinderGeometry args={[0.15, 0.25, 1.2, 8]} />
        <meshBasicMaterial 
          color="#004488" 
          transparent 
          opacity={0.2} 
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
                <Canvas 
                  camera={{ position: [0, 0, 4], fov: 60 }}
                  style={{ background: '#000011' }}
                >
                  <ambientLight intensity={0.1} color="#001122" />
                  <pointLight position={[0, 0, 5]} intensity={0.5} color="#00ffff" />
                  <pointLight position={[3, 3, 3]} intensity={0.3} color="#0099ff" />
                  <pointLight position={[-3, -3, 3]} intensity={0.3} color="#0066ff" />
                  <BrainStructure />
                  <OrbitControls 
                    enablePan={false} 
                    minDistance={2} 
                    maxDistance={8}
                    autoRotate
                    autoRotateSpeed={0.3}
                  />
                </Canvas>
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-center">
                <p className="animate-fade-in">Neural pathways lighting up • Click and drag to rotate • Scroll to zoom</p>
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