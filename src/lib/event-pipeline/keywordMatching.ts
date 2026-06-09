const KEYWORD_CONTEXT_PATTERNS: Record<string, RegExp> = {
  base: /\b(military|army|naval|air|missile|operating|troop|forces?)\b/i,
  carrier: /\b(aircraft|naval|fleet|warship|strike group|ship)\b/i,
  deployment:
    /\b(troops?|forces?|soldiers?|military|missiles?|aircraft|warships?|national guard)\b/i,
  deployed:
    /\b(troops?|forces?|soldiers?|military|missiles?|aircraft|warships?|national guard)\b/i,
  general: /\b(army|military|commander|commanded|forces?|troops?|brigade)\b/i,
  rally: /\b(protest|demonstrat|crowd|supporters?|march|campaign)\w*/i,
  viral: /\b(outbreak|disease|infection|cases?|health|hospital)\b/i,
  cluster: /\b(outbreak|disease|infection|cases?|health|hospital)\b/i,
  isolation: /\b(quarantine|disease|infection|health|patient)\w*/i,
  pipeline: /\b(oil|gas|energy|crude|fuel|physical|refinery)\b/i,
  patch: /\b(cve|software|security|vulnerabilit|exploit)\w*/i,
  leak: /\b(gas|oil|fuel|data|security|classified|documents?|chemical)\b/i,
  resolution: /\b(united nations|u\.n\.|security council|vote|adopted|passed)\b/i,
  government:
    /\b(coup|emergency|collapse|resign|overthrow|sanction|crisis|minister|president)\w*/i,
  vulnerabilities: /\b(cve|software|cyber|security|exploit|systems?)\b/i,
};

const EVENT_ACTION_PATTERN =
  /\b(attacks?|attacked|airstrikes?|strikes?|struck|raids?|ambush\w*|missiles?|rockets?|shelling|shelled|bomb\w*|explosions?|blasts?|detonat\w*|invasion|invaded|incursion|clashes?|fighting|firefight|killed|dead|wounded|injured|casualties|massacre|protests?|riots?|unrest|curfew|crackdown|arrests?|detained|seized|indicted|charged|convicted|sentenced|coup|ousted|resigned|state of emergency|martial law|sanctions?|banned|blocked|ordered|approved|passed|signed|declared|ceasefire|deployed|mobilized|intercepted|shot down|blackout|outages?|closures?|collapse\w*|disruption|shutdown|halted|suspended|reopened|earthquake|aftershock|tsunami|flood\w*|wildfire|hurricane|tornado|landslide|evacuat\w*|outbreak|epidemic|pandemic|quarantine|refugees?|famine|shooting|crash\w*|fire)\b/i;

const ROUNDUP_TITLE_PATTERN =
  /\b(news wrap|morning briefing|evening briefing|daily briefing|live updates?|what you need to know|top stories|and,\s|plus,\s)\b/i;
const NON_EVENT_TITLE_PATTERN =
  /\b(a list of|history of|explained|explainer|how .* built|stock market|stocks?|shares?|market jitters|investors?|oil prices?|world cup|podcast|newsletter)\b/i;

export function getWordRegex(term: string): RegExp {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

export function getContextualKeywordMatches(text: string, keywords: string[]) {
  return keywords.filter((keyword) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword || !getWordRegex(normalizedKeyword).test(text)) {
      return false;
    }

    const contextPattern = KEYWORD_CONTEXT_PATTERNS[normalizedKeyword];
    return !contextPattern || contextPattern.test(text);
  });
}

export function hasEventAction(text: string) {
  return EVENT_ACTION_PATTERN.test(text);
}

export function isRoundupTitle(title: string) {
  return ROUNDUP_TITLE_PATTERN.test(title);
}

export function isNonEventTitle(title: string) {
  return NON_EVENT_TITLE_PATTERN.test(title);
}

export function containsHistoricalYear(text: string, currentYear: number) {
  const years = Array.from(text.matchAll(/\b(19\d{2}|20\d{2})\b/g)).map(
    (match) => Number(match[1]),
  );

  return years.some((year) => year < currentYear - 1);
}
