export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}


// export const formatDateTest = (dateStr) => {
//   const date = new Date(dateStr)
//   const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
//   const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
//   const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
//   const month = mo.charAt(0).toUpperCase() + mo.slice(1)
//   //const month = mo.charAt(0) + mo.slice(1)
//   //return `${ye.toString().substr(2,4)} ${month.substr(0,3)}. ${parseInt(da)}  `
//   return `${ye.substr(2,4)} ${month.substr(0,3)}. ${parseInt(da)}  `
//   //return ` screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)` 
// }

export const formatDateTest = (dateNewFormat) => {
  var d = new Date(dateNewFormat),
	month = '' + (d.getMonth() + 1),
	day = '' + d.getDate(),
	year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if(day.length < 2) day ='0' + day;
  return [year, month, day].join('-');
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}