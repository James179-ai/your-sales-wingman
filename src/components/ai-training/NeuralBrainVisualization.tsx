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
      const pulseFactor = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.4 * intensity;
      meshRef.current.scale.setScalar(pulseFactor);
      
      if (glowRef.current) {
        glowRef.current.scale.setScalar(pulseFactor * 2.5);
      }
    }
  });

  const nodeSize = region === 'cortex' ? 0.04 : 0.06;
  const glowSize = region === 'cortex' ? 0.08 : 0.12;

  return (
    <group position={position}>
      {/* Main neuron node */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[nodeSize, 12, 12]} />
        <meshBasicMaterial 
          color={active ? '#8b5cf6' : '#6b46c1'}
          transparent
          opacity={active ? 1 : 0.6}
        />
      </mesh>
      
      {/* Outer glow effect */}
      {active && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[glowSize, 12, 12]} />
          <meshBasicMaterial 
            color="#a855f7"
            transparent
            opacity={0.3 * intensity}
          />
        </mesh>
      )}
      
      {/* Bright core for active neurons */}
      {active && (
        <mesh>
          <sphereGeometry args={[nodeSize * 0.5, 8, 8]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={0.9}
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
  
  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      const pulseBrightness = active ? 0.7 + Math.sin(state.clock.elapsedTime * 6 + pulse) * 0.3 : 0.2;
      material.opacity = pulseBrightness * strength;
      
      if (glowLineRef.current && active) {
        const glowMaterial = glowLineRef.current.material as THREE.LineBasicMaterial;
        glowMaterial.opacity = pulseBrightness * 0.4;
      }
    }
  });

  // Create straight lines for radiating effect
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const points = [startVec, endVec];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      {/* Main synapse line */}
      <primitive 
        ref={lineRef}
        object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
          color: active ? 0x8b5cf6 : 0x6b46c1,
          opacity: active ? 0.8 : 0.2,
          transparent: true,
          linewidth: 2
        }))} 
      />
      
      {/* Glow effect for active synapses */}
      {active && (
        <primitive 
          ref={glowLineRef}
          object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: 0xa855f7,
            opacity: 0.5,
            transparent: true,
            linewidth: 4
          }))} 
        />
      )}
    </group>
  );
}

function BrainStructure() {
  const brainRef = useRef<THREE.Group>(null);
  const [activeNeurons, setActiveNeurons] = useState(new Set<number>());
  
  // Create central brain structure and radiating pathways
  const neurons = [];
  const pathways = [];
  
  // Central brain neurons (dense core)
  for (let i = 0; i < 25; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 0.2 + Math.random() * 0.4;
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    neurons.push({
      position: [x, y, z] as [number, number, number],
      id: i,
      type: 'core'
    });
  }
  
  // Radiating pathway nodes
  for (let i = 0; i < 80; i++) {
    const angle = (i / 80) * Math.PI * 2;
    const elevation = (Math.random() - 0.5) * Math.PI * 0.8;
    const distance = 1.8 + Math.random() * 1.2;
    
    const x = distance * Math.cos(elevation) * Math.cos(angle);
    const y = distance * Math.cos(elevation) * Math.sin(angle);
    const z = distance * Math.sin(elevation);
    
    neurons.push({
      position: [x, y, z] as [number, number, number],
      id: i + 25,
      type: 'pathway'
    });
    
    // Create pathway connections from core to outer nodes
    const coreNodeIndex = Math.floor(Math.random() * 25);
    const coreNode = neurons[coreNodeIndex];
    pathways.push({
      start: coreNode.position,
      end: [x, y, z] as [number, number, number],
      id: i
    });
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Create wave patterns radiating from center
    const activeSet = new Set<number>();
    neurons.forEach((neuron, index) => {
      const distance = Math.sqrt(
        neuron.position[0] ** 2 + 
        neuron.position[1] ** 2 + 
        neuron.position[2] ** 2
      );
      
      const wave = Math.sin(time * 2.5 - distance * 1.5) * 0.5 + 0.5;
      if (wave > 0.65) {
        activeSet.add(index);
      }
    });
    
    setActiveNeurons(activeSet);
    
    // Gentle rotation
    if (brainRef.current) {
      brainRef.current.rotation.y = time * 0.06;
    }
  });

  return (
    <group ref={brainRef}>
      {/* Central brain structure */}
      <group>
        {/* Main brain mass */}
        <mesh>
          <sphereGeometry args={[0.6, 16, 12]} />
          <meshBasicMaterial 
            color="#8b5cf6" 
            transparent 
            opacity={0.15}
            wireframe
          />
        </mesh>
        
        {/* Brain hemispheres outline */}
        <mesh position={[-0.1, 0, 0]}>
          <sphereGeometry args={[0.5, 12, 8, 0, Math.PI]} />
          <meshBasicMaterial 
            color="#6b46c1" 
            transparent 
            opacity={0.2}
            wireframe
          />
        </mesh>
        
        <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI, 0]}>
          <sphereGeometry args={[0.5, 12, 8, 0, Math.PI]} />
          <meshBasicMaterial 
            color="#6b46c1" 
            transparent 
            opacity={0.2}
            wireframe
          />
        </mesh>
      </group>
      
      {/* Radiating pathways */}
      {pathways.map((pathway, index) => {
        const isActive = activeNeurons.has(index + 25);
        return (
          <Synapse
            key={`pathway-${index}`}
            start={pathway.start}
            end={pathway.end}
            active={isActive}
            pulse={index * 0.2}
            strength={isActive ? 0.9 : 0.3}
          />
        );
      })}
      
      {/* Neural nodes */}
      {neurons.map((neuron, index) => (
        <Neuron
          key={index}
          position={neuron.position}
          active={activeNeurons.has(index)}
          intensity={activeNeurons.has(index) ? 1.0 : 0.4}
          region={neuron.type === 'core' ? 'cortex' : 'frontal'}
        />
      ))}
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
                  camera={{ position: [0, 0, 5], fov: 60 }}
                  style={{ background: '#ffffff' }}
                >
                  <ambientLight intensity={0.3} color="#ffffff" />
                  <pointLight position={[0, 0, 5]} intensity={0.4} color="#8b5cf6" />
                  <pointLight position={[3, 3, 3]} intensity={0.2} color="#a855f7" />
                  <pointLight position={[-3, -3, 3]} intensity={0.2} color="#6b46c1" />
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