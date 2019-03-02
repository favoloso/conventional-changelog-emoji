module.exports = {
  headings: {
    /** Already provided in emoji-groups */
  },
  rules: {
    "body-leading-blank": "Body should begin with a leading blank line.",
    "emoji-from-type": `Type Alias "$0" is not allowed. It should be one of: $1.`,
    "emoji-known": `Emoji "$0" is not allowed. It should be one of: $1.`,
    "emoji-require": `Emoji is required, but it's not present in "$0".`,
    "header-max-length": `Header max length is $0 characters, $1 provided.`,
    "subject-require": `Subject is required, but it's not present in "$0".`
  }
};
