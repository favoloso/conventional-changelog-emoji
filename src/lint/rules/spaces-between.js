module.exports = {
  name: "spaces-between",
  rule: function(ctx, options, tokens) {
    if (!tokens.spaces) return;

    if (tokens.spaces === " ") return null;

    const spacedHeader = [tokens.emoji, tokens.subject].join(" ");
    return tokens.commit.replace(tokens.header, spacedHeader);
  }
};
