export function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

export function getInitials(name) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('')
}
