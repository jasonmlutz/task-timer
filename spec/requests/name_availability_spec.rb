require 'rails_helper'
require 'json'

RSpec.describe 'Name availability checking', type: :request do
  before do
    User.destroy_all
    User.create(name: 'jason', password: 'goodPassword')
  end

  context 'with available user name' do
    it 'returns name_available: true' do
      get '/api/check_availability/lutz'
      expect(JSON.parse(response.body)['name_available']).to be(true)
    end
  end

  context 'with unavailable user name' do
    it 'returns name_available: false' do
      get '/api/check_availability/jason'
      expect(JSON.parse(response.body)['name_available']).to be(false)
    end
  end
end
