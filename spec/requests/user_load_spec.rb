require 'rails_helper'
require 'json'

RSpec.describe 'User loading', type: :request do
  before do
    User.destroy_all
  end

  context 'with valid user id' do
    it 'returns user name and id' do
      User.create(name: 'jason', password: 'password')
      id = User.last.id
      get "/api/users/#{id}"
      expect(response.body).to eq({ id:, name: 'jason' }.to_json)
    end
  end

  context 'with invalid user id' do
    it 'returns error: record(s) not found' do
      get '/api/users/11235813'
      expect(response.body).to eq({ error: 'record(s) not found' }.to_json)
    end
  end
end
