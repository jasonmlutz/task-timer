# == Schema Information
#
# Table name: users
#
#  id              :uuid             not null, primary key
#  name            :string           not null
#  password_digest :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'Associations' do
    it { should have_many(:tasks)}
  end
  
  describe 'Validations' do
    before do
      User.create(name: 'shouldTest', password: 'shouldaPassword')
    end
    after do
      User.destroy_all
    end
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_uniqueness_of(:name) }
  end

  describe 'Authentication' do
    before do
      described_class.destroy_all
      @user = described_class.create(name: 'jason', password: 'password')
    end

    context 'with correct credentials' do
      it 'returns the correct user' do
        found = described_class.find_by(name: 'jason')&.authenticate('password')
        expect(found).to eq(@user)
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
