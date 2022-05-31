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
import Bills from "../containers/Bills.js";
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

  //Test de la fonction handleSubmit => OK
  describe("Given I am connected as an employee", () => {
    describe('When I am on newBill page, i fill out the form and i click on the submit button', () => {
      test('Then I should be sent on bills page', async () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
  
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
  
        const theNewBills = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          bills: bills,
          localStorage: window.localStorage,
        })
        document.body.innerHTML = NewBillUI()
  
        const handleSubmit = jest.fn((e) => theNewBills.handleSubmit(e))
        const newBillForm = screen.getByTestId('form-new-bill')
        newBillForm.addEventListener('submit', handleSubmit)
        fireEvent.submit(newBillForm)
        expect(handleSubmit).toHaveBeenCalled()
        const pageBills = screen.getByText('Mes notes de frais')
        expect(pageBills).toBeTruthy()
      })
    })
  })

 // Test de la fonction handleChangeFile
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
      // fireEvent.change(inputFile, {
      //   target: {
      //     files: [
      //     new File(["fichier"], "fichier.doc", {
      //     type: "fichier/doc",
      //       }),
      //     ],
      //   },
          
      // }) 

      expect(handleChangeFile).toHaveBeenCalled()
      expect(screen.findByText("Format de fichier non valide")).toBeTruthy() 
      expect(inputFile.files[0].name).toBe('fichier.doc');

    })
  })  

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







