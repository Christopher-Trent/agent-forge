import { EffectComposer, Bloom, SSAO, Vignette } from '@react-three/postprocessing';

export function Effects() {
  return (
    <EffectComposer multisampling={2} enableNormalPass>
      <SSAO samples={18} radius={0.18} intensity={18} luminanceInfluence={0.62} />
      <Bloom intensity={0.42} luminanceThreshold={0.72} luminanceSmoothing={0.24} mipmapBlur />
      <Vignette eskil={false} offset={0.18} darkness={0.58} />
    </EffectComposer>
  );
}
