require 'rails_helper'
require 'json'

RSpec.describe 'User creation', type: :request do
  before do
    User.destroy_all
  end

  context 'with unique username' do
    context 'with present and matching passwords' do
      it 'creates a user' do
        assert_difference('User.count') do
          headers = { 'CONTENT_TYPE' => 'application/json' }
          post api_users_url,
               params: { name: 'jason', password: 'goodPassword', password_confirmation: 'goodPassword' }.to_json, headers:
        end
        expect(User.last.name).to eq('jason')
      end

      it 'correctly sets session' do
        headers = { 'CONTENT_TYPE' => 'application/json' }
        post api_users_url,
             params: { name: 'jason', password: 'goodPassword', password_confirmation: 'goodPassword' }.to_json, headers: headers

        expect(session['current_user_id']).to eq(User.last.id)
      end

      it 'returns user.expose as the response body' do
        headers = { 'CONTENT_TYPE' => 'application/json' }
        post api_users_url,
             params: { name: 'jason', password: 'goodPassword', password_confirmation: 'goodPassword' }.to_json, headers: headers
        expect(response.body).to eq(User.last.expose.to_json)
      end
    end

    context 'with password validation errors' do
      context 'with password confirmation missing' do
        before do
          headers = { 'CONTENT_TYPE' => 'application/json' }
          post api_users_url, params: { name: 'jason', password: 'goodPassword' }.to_json, headers:
        end

        it 'fails to create user' do
          expect(User.last).to be_nil
        end

        it 'returns error message in body' do
          expect(response.body).to eq({ error: 'object(s) not created' }.to_json)
        end
      end

      context 'with non-matching passwords' do
        before do
          headers = { 'CONTENT_TYPE' => 'application/json' }
          post api_users_url,
               params: { name: 'jason', password: 'goodPassword', password_confirmation: 'badPassword' }.to_json, headers:
        end

        it 'fails to create user' do
          expect(User.last).to be_nil
        end

        it 'returns error message in body' do
          expect(response.body).to eq({ error: 'object(s) not created' }.to_json)
        end
      end
    end
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
