import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import SignupView from '../SignupView.vue'
import InMemoryUsersRepository from '../../infrastructure/persistence/in-memory-users-repository'

const inMemoryUsersRepository = InMemoryUsersRepository.getInstance()

describe('SignupView', () => {
  let wrapper, name, email, password, passwordConfirmation

  beforeEach(() => {
    inMemoryUsersRepository.deleteAll()
    wrapper = mount(SignupView)

    name = wrapper.get('[data-test="name"]')
    email = wrapper.get('[data-test="email"]')
    password = wrapper.get('[data-test="password"]')
    passwordConfirmation = wrapper.get('[data-test="passwordConfirmation"]')
  })

  it('should show the form and no errors', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.html()).not.toContain('Errors')
  })

  describe('when the form is invalid', () => {
    beforeEach(async () => {
      name.setValue('Chuck')
      email.setValue('chuck@norris.com')
      password.setValue('12341234')
      passwordConfirmation.setValue('12341234')
    })

    it('should show an error if the name is empty', async () => {
      name.setValue('')

      await wrapper.get('form').trigger('submit')

      expect(wrapper.get('.errors').text()).toEqual(
        'Oooops! Check these errors:Name cannot be blank',
      )
    })

    it('should show an error if the email is empty', async () => {
      email.setValue('')

      await wrapper.get('form').trigger('submit')

      expect(wrapper.get('.errors').text()).toEqual(
        'Oooops! Check these errors:Email cannot be blank',
      )
    })

    it('should show an error if the email has already been used', async () => {
      inMemoryUsersRepository.add({
        name: 'Chuck',
        email: 'chuck@norris.com',
        password: '23243563',
      })

      await wrapper.get('form').trigger('submit')

      expect(wrapper.get('.errors').text()).toEqual(
        'Oooops! Check these errors:Email has already been used',
      )
    })

    it('should show an error if the password is too short', async () => {
      password.setValue('1234')
      passwordConfirmation.setValue('1234')

      await wrapper.get('form').trigger('submit')

      expect(wrapper.get('.errors').text()).toEqual(
        'Oooops! Check these errors:Password must have 8 digits',
      )
    })

    it("should show an error if the passwords don't match", async () => {
      password.setValue('12345678')
      passwordConfirmation.setValue('877654321')

      await wrapper.get('form').trigger('submit')

      expect(wrapper.get('.errors').text()).toEqual(
        "Oooops! Check these errors:Passwords don't match",
      )
    })
  })

  describe('when the form is valid', () => {
    let wrapper

    beforeEach(async () => {
      wrapper = mount(SignupView)

      const name = wrapper.get('[data-test="name"]')
      const email = wrapper.get('[data-test="email"]')
      const password = wrapper.get('[data-test="password"]')
      const passwordConfirmation = wrapper.get('[data-test="passwordConfirmation"]')

      name.setValue('Chuck')
      email.setValue('chuck@norris.com')
      password.setValue('12341234')
      passwordConfirmation.setValue('12341234')

      await wrapper.get('form').trigger('submit')
    })

    it('should not show any errors', () => {
      expect(wrapper.html()).not.toContain('Errors')
    })

    it('should not show the form', () => {
      expect(wrapper.find('form').exists()).toBe(false)
    })

    it('should show a confirmation message', () => {
      expect(wrapper.html()).toContain('Please check your email to finish the signup process')
    })

    it('should create a user with an encripted password', async () => {
      expect(inMemoryUsersRepository.findByEmail('chuck@norris.com')).toEqual({
        email: 'chuck@norris.com',
        name: 'Chuck',
        password: 'MTIzNDEyMzQ=',
      })
    })
  })
})
