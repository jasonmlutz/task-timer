require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'Validations' do
    it { should validate_presence_of(:name) }
    it { should validate_uniqueness_of(:name) }
  end

  describe 'Authentication' do
    context 'with correct credentials' do
      it 'returns the correct user' do
        user = described_class.create(name: 'jason', password: 'password')
        found = described_class.find_by(name: 'jason')&.authenticate('password')
        expect(found).to eq(user)
      end
    end

    context 'with incorrect password' do
      it 'returns false' do
        described_class.create(name: 'jason', password: 'password')
        result = described_class.find_by(name: 'jason')&.authenticate('badPassword')
        expect(result).to be(false)
      end
    end
    context 'with incorrect name' do
      it 'returns nil' do
        described_class.create(name: 'jason', password: 'password')
        result = described_class.find_by(name: 'unknown')&.authenticate('password')
        expect(result).to be_nil
      end
    end
    context 'with incorrect name and password' do
      it 'returns nil' do
        described_class.create(name: 'jason', password: 'password')
        result = described_class.find_by(name: 'unknown')&.authenticate('badPassword')
        expect(result).to be_nil
      end
    end
  end
end
