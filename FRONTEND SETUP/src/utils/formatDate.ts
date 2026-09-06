export function formatDate(dataStr:Date|string) {
    if(!dataStr) return '';
    
  const date = new Date(dataStr);
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
