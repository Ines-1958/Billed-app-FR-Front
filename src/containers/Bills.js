import { ROUTES_PATH } from '../constants/routes.js'
//import { formatDate, formatStatus} from "../app/format.js"
import { formatDate, formatStatus, formatDateTest } from "../app/format.js"
import Logout from "./Logout.js"
import { bills } from '../fixtures/bills.js'

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
    
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }
  

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url")
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
    $('#modaleFile').modal('show')
    console.log(billUrl);
    console.log(imgWidth);
    console.log(icon)
  }
  

  getBills = () => {
    
    if (this.store) {
      console.log(this);
      console.log(this.store);
      return this.store
      .bills()
      .list()
      .then(snapshot => {
        const bills = snapshot

        .sort (function (a, b) {
          if(a.date < b.date) {
            return -1;
          } 
          else {
            return 1;
          };
        })
        
        .map(doc => {
            // console.log(doc);
            // console.log(doc.date);
            // console.log(doc.status);
            try {
              return {
                ...doc,
                //date: formatDate(doc.date),
                date: formatDateTest(doc.date),
                status: formatStatus(doc.status)
              }
            } catch(e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e,'for',doc)
              return {
                ...doc,
                date: doc.date,
                status: formatStatus(doc.status)
              }
            }
          })
      
          // console.log(bills);
          console.log('length', bills.length)
        return bills
      })
    }
  }
}

console.log(formatDate);
console.log(formatStatus);
console.log(formatDateTest)

// bills.sort((a,b) => a.date < b.date)
// const antiChrono = (a, b) => ((a < b) ? 1 : -1);
// const test = [...bills].sort(antiChrono);

const triDatesTest = (a, b) => ((a.date < b.date) ? -1 : 1);
const test = [...bills].sort(triDatesTest);
console.log(triDatesTest);
console.log(test);

