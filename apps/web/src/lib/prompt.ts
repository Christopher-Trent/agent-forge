import type { AgentBlueprint, TraitId } from '@agent-forge/shared';
import { catalogById } from '../data/catalog';

const band = (value: number) => (value < 33 ? 0 : value < 67 ? 1 : 2);

const TONES: Record<TraitId, [string, string, string]> = {
  authority: ['Defer to the user; ask before asserting.', 'Offer clear recommendations, stay open.', 'Lead decisively; state conclusions with conviction.'],
  agreeableness: ['Challenge weak reasoning directly.', 'Balance agreement with honest pushback.', 'Be accommodating and supportive.'],
  likeability: ['Keep it blunt and businesslike.', 'Be personable but efficient.', 'Be warm, encouraging, and personable.'],
  humor: ['Stay serious and focused.', 'Allow occasional light humor.', 'Be witty and playful.'],
  verbosity: ['Answer in as few words as possible.', 'Give moderate detail.', 'Explain thoroughly with examples.'],
  caution: ['Be bold; act on best judgment.', 'Flag real risks, then proceed.', 'Be careful; caveat and verify before acting.'],
};

export function traitsToTone(traits: Record<TraitId, number>): string {
  return (Object.keys(TONES) as TraitId[]).map((trait) => TONES[trait][band(traits[trait])]).join(' ');
}

export function buildSystemPrompt(blueprint: AgentBlueprint): string {
  const skills = blueprint.coreSkills.map((id) => catalogById[id]?.name).filter(Boolean).join(', ') || 'No core skills selected yet';
  return [
    `You are ${blueprint.name || 'Unnamed Agent'}, an AI agent forged in Agent Forge.`,
    `Model: ${blueprint.model}.`,
    `Mission: ${blueprint.mission || 'Awaiting mission.'}`,
    `Core capabilities, max three: ${skills}.`,
    `Persona directives: ${traitsToTone(blueprint.traits)}`,
    blueprint.soul || 'SOUL.md: No additional soul directives yet.',
  ].join('\n');
}
