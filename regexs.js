module.exports = {
  youBestRegex: /^(.*, )?(you|you're|ur|you are) (the|da|tha) (best|bes|bestest)/i,
  newBestRegex: /(.*[!,.:;] )?(.*[^,])('s| is| iz|,? you're|,? you're|,? you are|,? you|,? u| are| r) (the|teh|da|ze|duh|tha) (best|bez|bes|bestest)(.*[^\\?]$)/i,
  checkBestRegex: /(who's|who|who is) (the|da|ze) (best)[\\?]?/i,
  rescindRegex: /I take back that best declaration[.!]?/i,
}