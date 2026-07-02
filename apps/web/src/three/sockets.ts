import { Object3D, Vector3, type Group } from 'three';

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

export const fallbackSocketPositions: Record<string, [number, number, number]> = {
  socket_root: [0, 0, 0],
  socket_pelvis: [0, 0.62, 0.05],
  socket_chest: [0, 1.72, 0.42],
  socket_reactor: [0, 1.43, 0.56],
  socket_head: [0, 2.65, 0.18],
  socket_head_crown: [0, 2.98, 0.02],
  socket_head_eyes: [0, 2.58, 0.48],
  socket_back: [0, 1.82, -0.48],
  socket_hip_L: [-0.52, 0.82, 0.2],
  socket_hand_R: [-1.62, 0.84, 0.12],
  socket_hand_L: [1.62, 0.84, 0.12],
  socket_forearm_R: [-1.28, 1.22, 0.14],
  socket_forearm_L: [1.28, 1.22, 0.14],
  socket_shoulder_R: [-0.98, 2.06, 0.08],
  socket_shoulder_L: [0.98, 2.06, 0.08],
};

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
  Object.entries(fallbackSocketPositions).forEach(([name, position]) => {
    const socket = new Object3D();
    socket.name = name;
    socket.position.copy(new Vector3(...position));
    parent.add(socket);
    sockets.set(name, socket);
  });
  return sockets;
}
