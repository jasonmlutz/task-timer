require 'rails_helper'
require 'json'

RSpec.describe 'User creation', type: :request do
  before do
    User.destroy_all
  end

  context 'with unique username' do
    it 'creates a user' do
      assert_difference('User.count') do
        headers = { 'CONTENT_TYPE' => 'application/json' }
        post api_users_url, params: { name: 'jason', password: 'goodPassword' }.to_json, headers:
      end
      expect(JSON.parse(response.body).keys).to eq(%w[id name password_digest created_at updated_at])
      expect(JSON.parse(response.body)['name']).to eq('jason')
      expect(User.find_by(name: 'jason')).not_to be_nil
    end

    it 'correctly sets session'
  end

  context 'with non-unique username' do
    it 'receives error message' do
      User.create(name: 'jason', password: 'password')
      headers = { 'CONTENT_TYPE' => 'application/json' }
      post api_users_url, params: { name: 'jason', password: 'goodPassword' }.to_json, headers: headers
      expect(response.body).to eq({ error: 'name not available' }.to_json)
    end
  end
end
