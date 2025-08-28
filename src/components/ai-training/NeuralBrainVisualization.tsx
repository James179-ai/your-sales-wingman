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
  
  // Create simple brain structure with neural activity
  const neurons = [];
  for (let i = 0; i < 50; i++) {
    // Create neurons distributed in brain-like shape
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 0.8 + Math.random() * 0.4;
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.8; // Slightly flattened
    const z = r * Math.cos(phi) * 0.9;
    
    neurons.push({
      position: [x, y, z] as [number, number, number],
      id: i
    });
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Simple wave-based activation
    const activeSet = new Set<number>();
    neurons.forEach((neuron, index) => {
      const wave = Math.sin(time * 2 + index * 0.5) * 0.5 + 0.5;
      if (wave > 0.7) {
        activeSet.add(index);
      }
    });
    
    setActiveNeurons(activeSet);
    
    // Gentle rotation
    if (brainRef.current) {
      brainRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group ref={brainRef}>
      {/* Main brain hemispheres */}
      <group>
        {/* Left hemisphere */}
        <mesh position={[-0.4, 0, 0]}>
          <sphereGeometry args={[1.2, 32, 16, 0, Math.PI]} />
          <meshBasicMaterial 
            color="#001122" 
            transparent 
            opacity={0.3}
            wireframe
          />
        </mesh>
        
        {/* Right hemisphere */}
        <mesh position={[0.4, 0, 0]} rotation={[0, Math.PI, 0]}>
          <sphereGeometry args={[1.2, 32, 16, 0, Math.PI]} />
          <meshBasicMaterial 
            color="#001122" 
            transparent 
            opacity={0.3}
            wireframe
          />
        </mesh>
        
        {/* Brain stem */}
        <mesh position={[0, -1.0, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 0.8, 8]} />
          <meshBasicMaterial 
            color="#002244" 
            transparent 
            opacity={0.4}
            wireframe
          />
        </mesh>
        
        {/* Cerebellum */}
        <mesh position={[0, -0.6, -0.8]}>
          <sphereGeometry args={[0.5, 16, 12]} />
          <meshBasicMaterial 
            color="#001133" 
            transparent 
            opacity={0.3}
            wireframe
          />
        </mesh>
      </group>
      
      {/* Neural nodes */}
      {neurons.map((neuron, index) => (
        <Neuron
          key={index}
          position={neuron.position}
          active={activeNeurons.has(index)}
          intensity={activeNeurons.has(index) ? 0.8 : 0}
          region="cortex"
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