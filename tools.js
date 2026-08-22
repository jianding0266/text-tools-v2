// Word Counter
function updateWordCount() {
  const text = document.getElementById('wc-input').value;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.trim() === '' ? 0 : (text.match(/[.!?]+/g) || []).length || (text.trim().split(/[.!?]+/) .filter(s => s.trim()).length);
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.split('\n').filter(l => l.trim()).length);
  const readTime = Math.ceil(words / 200);
  document.getElementById('wc-words').textContent = words;
  document.getElementById('wc-chars').textContent = chars;
  document.getElementById('wc-chars-no-space').textContent = charsNoSpace;
  document.getElementById('wc-sentences').textContent = sentences;
  document.getElementById('wc-paragraphs').textContent = paragraphs;
  document.getElementById('wc-read-time').textContent = readTime + (readTime === 1 ? ' min' : ' mins');
  // Top words
  if (text.trim() === '') { document.getElementById('wc-top-words').innerHTML = '<p style="color:var(--text-muted)">Enter text to see top words</p>'; return; }
  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','can','shall','it','its','this','that','these','those','i','me','my','we','our','you','your','he','him','his','she','her','they','them','their','what','which','who','whom','how','when','where','why']);
  const wordFreq = {};
  text.toLowerCase().replace(/[^a-z0-9\s']/g, '').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w)).forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
  const sorted = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);
  if (sorted.length === 0) { document.getElementById('wc-top-words').innerHTML = '<p style="color:var(--text-muted)">No significant words found</p>'; return; }
  document.getElementById('wc-top-words').innerHTML = sorted.map(([word, count]) => <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border)"><span></span><span style="color:var(--primary-light)"></span></div>).join('');
}

// Case Converter
function convertCase(input, mode) {
  switch(mode) {
    case 'lower': return input.toLowerCase();
    case 'upper': return input.toUpperCase();
    case 'title': return input.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
    case 'sentence': return input.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
    case 'alternating': return input.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
    case 'reverse': return input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
    default: return input;
  }
}

// Text Diff
function computeDiff(oldText, newText) {
  const oldLines = oldText ? oldText.split('\n') : [];
  const newLines = newText ? newText.split('\n') : [];
  const maxLen = Math.max(oldLines.length, newLines.length);
  const result = [];
  for (let i = 0; i < maxLen; i++) {
    const oldLine = i < oldLines.length ? oldLines[i] : null;
    const newLine = i < newLines.length ? newLines[i] : null;
    if (oldLine === null) result.push({ type: 'add', text: newLine });
    else if (newLine === null) result.push({ type: 'remove', text: oldLine });
    else if (oldLine !== newLine) { result.push({ type: 'remove', text: oldLine }); result.push({ type: 'add', text: newLine }); }
    else result.push({ type: 'same', text: oldLine });
  }
  return result;
}

// Text Replacer
function replaceText(text, find, replace, regex, caseSensitive) {
  if (!find) return text;
  try {
    if (regex) {
      const flags = caseSensitive ? 'g' : 'gi';
      return text.replace(new RegExp(find, flags), replace);
    } else {
      if (!caseSensitive) { find = find.toLowerCase(); text = text.toLowerCase(); replace = replace.toLowerCase(); }
      return text.split(find).join(replace);
    }
  } catch(e) { return text; }
}
function countMatches(text, find, regex, caseSensitive) {
  if (!find) return 0;
  try {
    if (regex) {
      const flags = caseSensitive ? 'g' : 'gi';
      const matches = text.match(new RegExp(find, flags));
      return matches ? matches.length : 0;
    } else {
      let count = 0, pos = 0;
      const search = caseSensitive ? find : find.toLowerCase();
      const searchText = caseSensitive ? text : text.toLowerCase();
      while ((pos = searchText.indexOf(search, pos)) !== -1) { count++; pos += search.length; }
      return count;
    }
  } catch(e) { return 0; }
}

// List Sorter
function sortLines(text, method) {
  const lines = text.split('\n');
  switch(method) {
    case 'az': return lines.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    case 'za': return lines.sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));
    case 'short': return lines.sort((a, b) => a.length - b.length);
    case 'long': return lines.sort((a, b) => b.length - a.length);
    case 'random': return lines.sort(() => Math.random() - 0.5);
    case 'reverse': return lines.reverse();
    case 'nodup': return [...new Set(lines)];
    default: return lines;
  }
}

// Markdown (simple parser)
function parseMarkdown(md) {
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3></h3>')
    .replace(/^## (.+)$/gm, '<h2></h2>')
    .replace(/^# (.+)$/gm, '<h1></h1>')
    .replace(/^\* (.+)$/gm, '<li></li>')
    .replace(/^- (.+)$/gm, '<li></li>')
    .replace(/\*\*(.+)\*\*/g, '<strong></strong>')
    .replace(/\*(.+)\*/g, '<em></em>')
    .replace(/([^]+)/g, '<code></code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href=""></a>')
    .replace(/\n/g, '<br>');
}
