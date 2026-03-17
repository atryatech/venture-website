export const homeSectionLinks = [
  { label: 'Serviços', sectionId: 'capabilities' },
  { label: 'Cases', sectionId: 'cases' },
  { label: 'Insights', sectionId: 'insights' },
  { label: 'Contato', sectionId: 'contact' },
] as const;

const pinnedSectionOffsets: Record<string, number> = {
  capabilities: 0.22,
  cases: 0.22,
};

export function getHomeSectionHref(sectionId: string): string {
  return `/#${sectionId}`;
}

export function scrollToHomeSection(sectionId: string): boolean {
  const target = document.getElementById(sectionId);

  if (!target) {
    return false;
  }

  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  const offsetProgress = pinnedSectionOffsets[sectionId] ?? 0;
  const scrollTarget = Math.max(0, targetTop + window.innerHeight * offsetProgress);

  window.history.replaceState(null, '', getHomeSectionHref(sectionId));
  window.scrollTo({ top: scrollTarget, behavior: 'smooth' });

  return true;
}