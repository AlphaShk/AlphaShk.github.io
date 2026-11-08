// The address is written into the page as HTML character references only, so it
// never appears as plain text in the source.
export const encodeEntities = (s: string) => [...s].map((c) => `&#${c.codePointAt(0)};`).join('');

export function obfuscatedLabel(email: string) {
  const [user, domain = ''] = email.split('@');
  const [host, ...tld] = domain.split('.');
  return `${encodeEntities(user)} <span class="obf__sep">[at]</span> ${encodeEntities(host)} <span class="obf__sep">[dot]</span> ${encodeEntities(tld.join('.'))}`;
}

export function mailtoHref(email: string) {
  return encodeEntities(`mailto:${email}`);
}
