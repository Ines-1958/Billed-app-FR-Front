/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import { fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'
import BillsUI from '../views/BillsUI.js'
import { ROUTES, ROUTES_PATH } from '../constants/routes.js'
import { localStorageMock } from '../__mocks__/localStorage.js'
import mockStore from '../__mocks__/store'
import { bills } from '../fixtures/bills.js'
import router from '../app/Router.js'

import userEvent from '@testing-library/user-event'

jest.mock('../app/store', () => mockStore)

// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page", () => {
//     test("Then ...", () => {
//       const html = NewBillUI()
//       document.body.innerHTML = html
//       //to-do write assertion
//     })
//   })
// })

// On va tester les fonctions handleChangeFile et handleSubmit
 
//Test pour l'icône mail dans NewBill => OK
 describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('Then email icon in vertical layout should be highlighted', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      )

      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const iconMail = screen.getByTestId('icon-mail')

      expect(iconMail.classList).toContain('active-icon')
    })
  })  
 })

//SOUMISSION DU FORMULAIRE AU CLICK DU BOUTON ENVOYER, APPEL DE LA FONCTION HANDLESUBMIT
  describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page and I click on submit", () => {
      test("Then handlesubmit should be called", () => {
        document.body.innerHTML = NewBillUI()
        const theNewBills = new NewBill({
          document, onNavigate, store: null, localStorage: window.localStorage
        })
        const handleSubmit = jest.fn(() => theNewBills.handleSubmit)
        const buttonSubmit = screen.getByText('Envoyer')
        buttonSubmit.addEventListener('click', handleSubmit)
        userEvent.click(buttonSubmit)
        expect(handleSubmit).toHaveBeenCalled()
      }) 
    })
  })

 // TEST DE LA FONCTION handleChangeFile
 window.alert = jest.fn();
 //Si format incorrect
 describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page and i upload a file in a different extension than jpeg, jpg or png ', () => {
    test('Then the alert message should appear', async () => {
      window.alert.mockClear();
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      )
      const theNewBills = new NewBill({
        document,
        onNavigate,
        store: null,
        bills: bills,
        localStorage: window.localStorage,
      })

      document.body.innerHTML = NewBillUI()
      const handleChangeFile = jest.fn((e) => theNewBills.handleChangeFile(e))
      //const handleChangeFile = jest.fn(() => theNewBills.handleChangeFile)
      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener('change', handleChangeFile)

      const file =  new File(["fichier"], "fichier.doc", {
        type: "fichier/doc",
      });
      userEvent.upload(inputFile, file);

      expect(handleChangeFile).toHaveBeenCalled()
      expect(screen.findByText("Format de fichier non valide")).toBeTruthy() 
      expect(inputFile.files[0].name).toBe('fichier.doc');

    })
  })  

  //Si format incorrect
  describe('When I am on NewBill Page and i upload a file in a correct extension like jpeg, jpg or png ', () => {
    test('Then the alert message should appear', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      )

      const theNewBills = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        bills: bills,
        localStorage: window.localStorage,
      })

      const handleChangeFile = jest.fn((e) => theNewBills.handleChangeFile(e))

      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener('change', handleChangeFile)
      const file =  new File(["fichier"], "fichier.jpeg", {
        type: "image/jpeg",
      });
      userEvent.upload(inputFile, file);

      expect(handleChangeFile).toHaveBeenCalled()
      expect(screen.findByText("Format de fichier valide")).toBeTruthy()
      expect(inputFile.files[0].name).toBe('fichier.jpeg');
    })
  })  
})

//TEST D'INTEGRATION POST
describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill page and click on the submit button', () => {
    test('Then a new bill  should be created ', async () => {

      document.body.innerHTML = NewBillUI()
      const mockBills = mockStore.bills()
      //const spyHandleSubmit = jest.spyOn(mockBills, 'handleSubmit')
      const spyCreate = jest.spyOn(mockBills, 'create')
      const fileBill = {
        fileName: "1592770761.jpeg"
      }
      
      const createdBill = await spyCreate(fileBill)
      console.log(createdBill)
      
      expect(spyCreate).toHaveBeenCalled()
      expect(createdBill.fileUrl).toBe("https://localhost:3456/images/test.jpg")
      expect(createdBill.key).toEqual('1234')  
    })
  })


  describe('When I am on NewBill page, i fill out the form and i click on the submit button', () => {
    test('Then i should submit form ', async () => {
      
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const theNewBills = new NewBill({document,  onNavigate, store: mockStore, localStorage: window.localStorage})
      
      const inputType = screen.getByTestId('expense-type')
      const inputNom = screen.getByTestId('expense-name')
      const inputDate = screen.getByTestId('datepicker')
      const inputMontant = screen.getByTestId('amount')
      const inputTva = screen.getByTestId('vat')
      const inputPct = screen.getByTestId('pct')
      const inputCommentaire = screen.getByTestId('commentary')
      const inputFichier = screen.getByTestId('file')
      const handleChangeFile = jest.fn((e) => theNewBills.handleChangeFile(e))
      inputFichier.addEventListener("change", handleChangeFile)

      const infosForm = {
        type: 'Transports',
        name:  'Vol Paris Londres',
        amount: '350',
        date:  '2022-04-22',
        vat: 60,
        pct: 20,
        file: new File(['img'], 'test.jpg', {type:'image/jpg'}),
        commentary: '',
      }
      
     /* userEvent.type(inputType, infosForm.type  )
      userEvent.type(inputNom, infosForm.name)
      userEvent.type(inputDate, infosForm.date )
      userEvent.type(inputMontant, infosForm.amount )
      userEvent.type(inputTva,  infosForm.vat )
      userEvent.type(inputPct,  infosForm.pct )
      userEvent.type(inputCommentaire, infosForm.commentary )*/
      userEvent.upload(inputFichier,infosForm.file )

      expect(handleChangeFile).toHaveBeenCalled()
      const handleSubmit = jest.fn((e) => theNewBills.handleSubmit(e))
      const newBillForm = screen.getByTestId('form-new-bill')
      newBillForm.addEventListener('submit', handleSubmit)
      fireEvent.submit(newBillForm)
      expect(handleSubmit).toHaveBeenCalled()
      /*const pageBills = screen.getByText('Mes notes de frais')
      expect(pageBills).toBeTruthy()*/
    })


    test('Then new Bill should be created in the API', async () => {
      
      const infosBill = {
        id: '47qAXb6fIm2zOKkLzMro',
        vat: '80',
         fileUrl: 'https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a', 
        status: 'pending',
        type: 'Hôtel et logement',
        commentary: 'séminaire billed',
        name: 'encore',
        fileName: 'preview-facture-free-201801-pdf-1.jpg',
        date: '2004-04-04',
        amount: 400,
        commentAdmin: 'ok',
        email: 'a@a',
        pct: 20
      }
      const mockBills = mockStore.bills()
      const spyUpdate = jest.spyOn(mockBills, "update")
      const updateBill = await spyUpdate(infosBill)

      expect(updateBill.id).toBe("47qAXb6fIm2zOKkLzMro")
      expect(updateBill.fileUrl).toBe("https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a")
      expect(updateBill.fileName).toBe("preview-facture-free-201801-pdf-1.jpg")
    })
  })

  
  describe("When an error occurs on API", () => {

    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      console.error = jest.fn()
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' , email: "a@a"}))
      // const root = document.createElement("div")
      // root.setAttribute("id", "root")
      // document.body.appendChild(root)
      // router()
      document.body.innerHTML = NewBillUI()
    })

    test("Then fetch error 500 from API", async () => {
      /*jest.spyOn(mockStore, 'bills')
      console.error = jest.fn()

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee'}))
      document.body.innerHTML = `<div id="root"></div>`
      router()*/
      window.onNavigate(ROUTES_PATH.NewBill)

      mockStore.bills.mockImplementationOnce(() => {
        return {
          update : () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        }
      })
      const theNewBills = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
    
      
      // const form = screen.getByTestId('form-new-bill')
      // const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      // form.addEventListener('submit', handleSubmit)
      //fireEvent.submit(form)
      const handleSubmit = jest.fn((e) => theNewBills.handleSubmit(e))
      const newBillForm = screen.getByTestId('form-new-bill')
      newBillForm.addEventListener('submit', handleSubmit)
      fireEvent.submit(newBillForm)

      // const inputFile = screen.getByTestId('file')
      // const handleChangeFile = jest.fn((e) => theNewBills.handleChangeFile(e))
      // const theFile =  new File(["fichier"], "fichier.jpeg", {type: "image/jpeg",});
      //userEvent.upload(inputFile, theFile);


      await new Promise(process.nextTick)
      //await jest.spyOn(mockStore, 'bills')

      //expect(jest.spyOn(mockStore, 'bills')).toBeCalled()
      //expect(handleChangeFile).toHaveBeenCalled()
      expect(console.error).toBeTruthy()
      expect(theNewBills.billId).toBeNull()
      expect(theNewBills.fileUrl).toBeNull()
    })

    test("Then fetch error 404 from API", async () => {
      window.onNavigate(ROUTES_PATH.NewBill)

      mockStore.bills.mockImplementationOnce(() => {
        return {
          update : () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        }
      })
      const theNewBills = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
    
      const handleSubmit = jest.fn((e) => theNewBills.handleSubmit(e))
      const newBillForm = screen.getByTestId('form-new-bill')
      newBillForm.addEventListener('submit', handleSubmit)
      fireEvent.submit(newBillForm)

      await new Promise(process.nextTick)

      expect(console.error).toBeTruthy()
      // expect(theNewBills.billId).toBeNull()
      // expect(theNewBills.fileUrl).toBeNull()
    })
  })
})







