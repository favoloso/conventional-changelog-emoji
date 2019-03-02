module.exports = {
  headings: {
    fix: `🐛 Bug Fix`,
    improvement: `🛠 Migliorie`,
    feat: `✨ Nuove Funzionalità`,
    chore: `🏗 Modifiche Interne`,
    perf: `⚡️ Performance`,
    refactor: `♻️ Refactor`,
    docs: `📚 Documentazione`,
    breaking: `🚨 Breaking Change`,
    security: `🔓 Sicurezza`
  },
  rules: {
    "body-leading-blank":
      "Il <body> del commit deve iniziare con una nuova linea (\\n)",
    "emoji-from-type": `Il tipo "$0" non è permesso. Deve essere uno fra: $1.`,
    "emoji-known": `L'Emoji "$0" non è permessa. Deve essere una fra: $1.`,
    "emoji-require": `L'Emoji è richiesta, ma non è presente nè deducibile dal tipo in "$0".`,
    "header-max-length": `La lunghezza massima dell'intestazione è di $0 caratteri, $1 forniti.`,
    "subject-require": `Il Soggetto è richiesto, ma non è presente in "$0".`
  }
};
