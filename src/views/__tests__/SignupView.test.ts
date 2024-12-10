import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import SignupView from '../SignupView.vue'
import InMemoryUsersRepository from '../../infrastructure/persistence/in-memory-users-repository'
import User from '../../domain/models/user'

const inMemoryUsersRepository = InMemoryUsersRepository.getInstance()

describe('SignupView', () => {
  let wrapper, name, email, birthDate, password, passwordConfirmation

  beforeEach(() => {
    inMemoryUsersRepository.deleteAll()
    wrapper = mount(SignupView, {
      global: {
        provide: {
          usersRepository: InMemoryUsersRepository.getInstance(),
        },
      },
    })

    name = wrapper.get('[data-test="name"]')
    email = wrapper.get('[data-test="email"]')
    birthDate = wrapper.get('[data-test="birthday"]')
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
      birthDate.setValue('1981-11-12')
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

    it('should show an error if the email is invalid', async () => {
      email.setValue('an invalid email')

      await wrapper.get('form').trigger('submit')

      expect(wrapper.get('.errors').text()).toEqual('Oooops! Check these errors:Email is not valid')
    })

    it('should show an error if the email has already been used', async () => {
      const user = new User({
        name: 'Chuck',
        email: 'chuck@norris.com',
        birthDate: '1981-11-12',
        encryptedPassword: '23243563',
      })
      inMemoryUsersRepository.add(user)

      await wrapper.get('form').trigger('submit')

      expect(wrapper.get('.errors').text()).toEqual(
        'Oooops! Check these errors:Email has already been used',
      )
    })

    it('should show an error if the birthday is empty', async () => {
      birthDate.setValue('')

      await wrapper.get('form').trigger('submit')

      expect(wrapper.get('.errors').text()).toEqual(
        'Oooops! Check these errors:Birthday cannot be blank',
      )
    })

    // FIXME: This test will fail in the future. We should mock the system date
    it('should show an error if the user is not older than 18', async () => {
      birthDate.setValue('2020-10-10')

      await wrapper.get('form').trigger('submit')

      expect(wrapper.get('.errors').text()).toEqual(
        'Oooops! Check these errors:You must be older than 18',
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

    it('should show multiple errors', async () => {
      name.setValue('')
      email.setValue('')

      await wrapper.get('form').trigger('submit')

      expect(wrapper.get('.errors').text()).toEqual(
        'Oooops! Check these errors:Name cannot be blankEmail cannot be blank',
      )
    })
  })

  describe('when the form is valid', () => {
    let wrapper

    beforeEach(async () => {
      wrapper = mount(SignupView, {
        global: {
          provide: {
            usersRepository: InMemoryUsersRepository.getInstance(),
          },
        },
      })

      const name = wrapper.get('[data-test="name"]')
      const email = wrapper.get('[data-test="email"]')
      const birthDate = wrapper.get('[data-test="birthday"]')
      const password = wrapper.get('[data-test="password"]')
      const passwordConfirmation = wrapper.get('[data-test="passwordConfirmation"]')

      name.setValue('Chuck')
      email.setValue('chuck@norris.com')
      birthDate.setValue('1981-11-12')
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
      expect(wrapper.html()).toContain(
        'We sent you an email to chuck@norris.com to complete the registration process',
      )
    })

    it('should create a user with an encripted password', async () => {
      const user = new User({
        email: 'chuck@norris.com',
        name: 'Chuck',
        birthDate: '1981-11-12',
        encryptedPassword: 'MTIzNDEyMzQ=',
      })
      expect(inMemoryUsersRepository.findByEmail('chuck@norris.com')).toEqual(user)
    })
  })
})
