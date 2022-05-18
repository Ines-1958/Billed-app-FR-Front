/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import Dashboard from "../containers/Dashboard.js";

import Bills from "../containers/Bills.js";
import userEvent from '@testing-library/user-event'



describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList).toContain("active-icon")
      
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      //const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const antiChrono = (a, b) => ((a.value < b.value) ? -1 : 1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
      
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page and I click on button new bill", () => {
    test("Then correct form should be appear", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      //document.body.innerHTML = BillsUI(bills[0])
      window.onNavigate(ROUTES_PATH.Bills)
      const store = null
      const theBills = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      const handleClickNewBill = jest.fn(theBills.handleClickNewBill)

      const buttonNewBill = screen.getAllByTestId("btn-new-bill")
      buttonNewBill.addEventListener("click", handleClickNewBill)
      userEvent.click(buttonNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()
      expect(screen.getByTestId('form-new-bill')).toBeTruthy()
      
 
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe('When I click on the icon eye', () => {
    test('A modal should open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      document.body.innerHTML = BillsUI(bills[0])
      
      // const onNavigate = (pathname) => {
      //   document.body.innerHTML = ROUTES({ pathname })
      // }
      window.onNavigate(ROUTES_PATH.Bills)
      const store = null
      // const theBills = bills({
      //   document, onNavigate, store, bills, localStorage: window.localStorage
      // })
      const theBills = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      const handleClickIconEye = jest.fn(theBills.handleClickIconEye)
      //const handleClickIconEye = jest.fn()
      //$.fn.modal = jest.fn()
      const eye = screen.queryByTestId('icon-eye')
      //const eye = document.getElementById('icon-eye')
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye(eye)).toHaveBeenCalled()

      const modale = screen.getByTestId('modaleFile')
      expect(modale).toBeTruthy()
    })
  })
})