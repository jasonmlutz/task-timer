require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'Validations' do
    context 'when username is empty string' do
      it 'User is not valid' do
        user = described_class.new(name: '', password: 'password')
        expect(user.valid?).to be(false)
      end
    end

    context 'when username is not empty' do
      it 'User is valid' do
        user = described_class.new(name: 'jason', password: 'password')
        expect(user.valid?).to be(true)
      end
    end

    context 'when name is not passed' do
      it 'User is not valid' do
        user = described_class.new(password: 'password')
        expect(user.valid?).to be(false)
      end
    end

    context 'when name is not unique' do
      it 'User is not valid' do
        described_class.create(name: 'bob', password: 'password')
        bob_jr = described_class.new(name: 'bob', password: 'passwordJr')
        expect(bob_jr.valid?).to be(false)
      end
    end

    context 'when name is unique' do
      it 'User is not valid' do
        described_class.create(name: 'bob', password: 'password')
        alice = described_class.new(name: 'alice', password: 'password')
        expect(alice.valid?).to be(true)
      end
    end
  end

  # context 'Authentication' do
  # end
end
