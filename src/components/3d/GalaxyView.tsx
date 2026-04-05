/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useComputedStore } from '../../store/useAppStore';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

export default function GalaxyView() {
  const { transactions } = useComputedStore();

  // Separate income and expense transactions
  const incomeTxs = useMemo(() => 
    transactions.filter(t => t.type === 'income'), 
    [transactions]
  );
  
  const expenseTxs = useMemo(() => 
    transactions.filter(t => t.type === 'expense'), 
    [transactions]
  );

  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Income Sphere */}
      <IncomeCenter transactions={incomeTxs} />
      
      {/* Orbiting Expenses */}
      <ExpenseOrbits transactions={expenseTxs} />
    </group>
  );
}

function IncomeCenter({ transactions }: { transactions: any[] }) {
  const centerRef = useRef<THREE.Mesh>(null);
  
  const totalIncome = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const centerSize = Math.max(1, Math.min(3, totalIncome / 5000));

  useFrame((state) => {
    if (centerRef.current) {
      centerRef.current.rotation.y += 0.005;
      centerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group>
      {/* Central Income Sphere */}
      <mesh ref={centerRef}>
        <sphereGeometry args={[centerSize, 32, 32]} />
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981"
          emissiveIntensity={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Income Label */}
      <Text position={[0, centerSize + 0.8, 0]} fontSize={0.6} color="#10b981" anchorX="center" anchorY="middle">
        Income Center
      </Text>
      <Text position={[0, centerSize + 0.3, 0]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">
        ₹{totalIncome.toLocaleString()}
      </Text>
    </group>
  );
}

function ExpenseOrbits({ transactions }: { transactions: any[] }) {
  const orbitGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += 0.008;
      orbitGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={orbitGroupRef}>
      {transactions.map((tx: any, i: number) => {
        const angle = (i / transactions.length) * Math.PI * 2;
        const radius = 4 + (Math.abs(tx.amount) / 1000); // Distance based on amount
        const height = Math.sin(i * 0.5) * 1.5; // Some vertical variation
        
        return (
          <group key={tx.id}>
            <mesh 
              position={[
                Math.cos(angle) * radius, 
                height, 
                Math.sin(angle) * radius
              ]}
            >
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial 
                color="#ef4444" 
                emissive="#ef4444" 
                emissiveIntensity={1.5} 
              />
            </mesh>
            <Text 
              position={[
                Math.cos(angle) * radius, 
                height + 0.3, 
                Math.sin(angle) * radius
              ]} 
              fontSize={0.2} 
              color="#ef4444" 
              anchorX="center" 
              anchorY="middle"
            >
              ₹{Math.abs(tx.amount).toLocaleString()}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
