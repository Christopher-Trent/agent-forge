import { Object3D, Euler, Vector3, type Group } from 'three';

export const REQUIRED_SOCKETS = [
  'socket_chest',
  'socket_reactor',
  'socket_head',
  'socket_head_crown',
  'socket_head_eyes',
  'socket_back',
  'socket_hip_L',
  'socket_hand_R',
  'socket_hand_L',
  'socket_forearm_R',
  'socket_forearm_L',
  'socket_shoulder_R',
  'socket_shoulder_L',
] as const;

export type SocketName = (typeof REQUIRED_SOCKETS)[number] | string;

export interface SocketSpec {
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  normal?: [number, number, number];
}

export const fallbackSocketSpecs: Record<string, SocketSpec> = {
  socket_root: { name: 'socket_root', position: [0, 0, 0], normal: [0, 0, 1], scale: 1 },
  socket_pelvis: { name: 'socket_pelvis', position: [0, 0.62, 0.08], normal: [0, 0, 1], scale: 0.85 },
  socket_chest: { name: 'socket_chest', position: [0, 1.72, 0.48], rotation: [0.08, 0, 0], normal: [0, 0.18, 1], scale: 0.9 },
  socket_reactor: { name: 'socket_reactor', position: [0, 1.42, 0.62], rotation: [0, 0, 0], normal: [0, 0, 1], scale: 0.74 },
  socket_head: { name: 'socket_head', position: [0, 2.58, 0.34], rotation: [0.03, 0, 0], normal: [0, 0, 1], scale: 0.58 },
  socket_head_crown: { name: 'socket_head_crown', position: [0, 2.86, 0.02], rotation: [-0.1, 0, 0], normal: [0, 1, 0.15], scale: 0.55 },
  socket_head_eyes: { name: 'socket_head_eyes', position: [0, 2.55, 0.55], rotation: [0, 0, 0], normal: [0, 0, 1], scale: 0.48 },
  socket_back: { name: 'socket_back', position: [0, 1.78, -0.52], rotation: [0, Math.PI, 0], normal: [0, 0, -1], scale: 0.9 },
  socket_hip_L: { name: 'socket_hip_L', position: [-0.48, 0.84, 0.22], rotation: [0, 0, 0.18], normal: [-0.35, 0, 0.9], scale: 0.62 },
  socket_hand_R: { name: 'socket_hand_R', position: [-1.45, 0.72, 0.22], rotation: [0.12, 0, -0.26], normal: [-0.2, -0.3, 0.9], scale: 0.66 },
  socket_hand_L: { name: 'socket_hand_L', position: [1.45, 0.72, 0.22], rotation: [0.12, 0, 0.26], normal: [0.2, -0.3, 0.9], scale: 0.66 },
  socket_forearm_R: { name: 'socket_forearm_R', position: [-1.18, 1.2, 0.26], rotation: [0.08, 0, -0.2], normal: [-0.12, 0, 0.95], scale: 0.68 },
  socket_forearm_L: { name: 'socket_forearm_L', position: [1.18, 1.2, 0.26], rotation: [0.08, 0, 0.2], normal: [0.12, 0, 0.95], scale: 0.68 },
  socket_shoulder_R: { name: 'socket_shoulder_R', position: [-0.9, 2.08, 0.18], rotation: [0.02, 0, -0.22], normal: [-0.2, 0.3, 0.9], scale: 0.76 },
  socket_shoulder_L: { name: 'socket_shoulder_L', position: [0.9, 2.08, 0.18], rotation: [0.02, 0, 0.22], normal: [0.2, 0.3, 0.9], scale: 0.76 },
};

export const fallbackSocketPositions: Record<string, [number, number, number]> = Object.fromEntries(
  Object.entries(fallbackSocketSpecs).map(([name, spec]) => [name, spec.position]),
);

export const friendlyMountLabels: Record<string, string> = {
  socket_chest: 'chest rail',
  socket_reactor: 'reactor core',
  socket_head: 'helmet optic',
  socket_head_crown: 'crown hardpoint',
  socket_head_eyes: 'visor array',
  socket_back: 'spine dock',
  socket_hip_L: 'left utility hip',
  socket_hand_R: 'right hand tool',
  socket_hand_L: 'left hand tool',
  socket_forearm_R: 'right forearm rail',
  socket_forearm_L: 'left forearm rail',
  socket_shoulder_R: 'right shoulder pylon',
  socket_shoulder_L: 'left shoulder pylon',
};

export function getFriendlyMountLabel(slot: string) {
  return friendlyMountLabels[slot] ?? 'universal hardpoint';
}

export function getSocketSpec(name: string): SocketSpec {
  return fallbackSocketSpecs[name] ?? fallbackSocketSpecs.socket_chest;
}

export function indexSockets(root: Object3D) {
  const sockets = new Map<string, Object3D>();
  root.traverse((node) => {
    if (node.name?.startsWith('socket_')) sockets.set(node.name, node);
  });
  return sockets;
}

export function validateSockets(sockets: Map<string, Object3D>, required = REQUIRED_SOCKETS) {
  return required.filter((socket) => !sockets.has(socket));
}

export function makeFallbackSockets(parent: Group) {
  const sockets = new Map<string, Object3D>();
  Object.values(fallbackSocketSpecs).forEach((spec) => {
    const socket = new Object3D();
    socket.name = spec.name;
    socket.position.copy(new Vector3(...spec.position));
    if (spec.rotation) socket.rotation.copy(new Euler(...spec.rotation));
    if (spec.scale) socket.scale.setScalar(spec.scale);
    parent.add(socket);
    sockets.set(spec.name, socket);
  });
  return sockets;
}
