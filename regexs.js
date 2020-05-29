module.exports = {
  youBestRegex: /(you|you're|ur|you are|u|u r) (the|da|tha) (best|bes|bestest)/i,
  ambiguousBestRegex: /^(.*, )?(that's|that is|he is|he's|she is|she's|it is|it's|they are|they're|we're|we are|we r) (the|da|tha) (best|bes|bestest)/i,
  newBestRegex: /(.*[!,.:;] )?(.*[^,])('s| is| iz|,? you're|,? you're|,? you are|,? you|,? u| are| r) (the|teh|da|ze|duh|tha) (best|bez|bes|bestest)(.*[^\\?]$)/i,
  checkBestRegex: /(who's|who|who is) (the|da|ze) (best)[\\?]?/i,
  rescindRegex: /I take back that best declaration[.!]?/i,
}