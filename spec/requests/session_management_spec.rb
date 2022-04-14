require 'rails_helper'
require 'json'

RSpec.describe 'Session management', type: :request do
  before do
    User.destroy_all
    User.create(name: 'jason', password: 'password')
  end

  describe 'user login' do
    context 'with correct credentials' do
      before do
        headers = { 'CONTENT_TYPE' => 'application/json' }
        post api_session_url, params: { name: 'jason', password: 'password' }.to_json, headers:
      end

      it 'sets session' do
        expect(session['current_user_id']).to eq(User.find_by(name: 'jason').id)
      end

      it 'returns the intended response' do
        expect(response.body).to eq(User.last.to_json)
      end
    end

    context 'with incorrect credentials' do
      before do
        headers = { 'CONTENT_TYPE' => 'application/json' }
        post api_session_url, params: { name: 'jason', password: 'badPassword' }.to_json, headers:
      end

      it 'does not set session[current_user_id]' do
        expect(session['current_user_id']).to be_nil
      end

      it 'returns the intended response' do
        expect(response.body).to eq({ error: 'name and/or password incorrect' }.to_json)
      end
    end
  end

  describe 'fetching session details' do
    context 'with no current user' do
      it 'returns empty {} response' do
        get api_session_url
        expect(response.body).to eq({}.to_json)
      end
    end

    context 'with current user' do
      it 'returns current user details' do
        headers = { 'CONTENT_TYPE' => 'application/json' }
        post api_session_url, params: { name: 'jason', password: 'password' }.to_json, headers: headers
        get api_session_url

        expect(response.body).to eq(User.last.to_json)
      end
    end
  end

  describe 'user logout' do
    context 'with no current user' do
      it 'returns `no user to logout` message' do
        delete api_session_url
        expect(response.body).to eq({ message: 'no user to logout!' }.to_json)
      end
    end

    context 'with current user' do
      before do
        headers = { 'CONTENT_TYPE' => 'application/json' }
        post api_session_url, params: { name: 'jason', password: 'password' }.to_json, headers: headers
        delete api_session_url
      end

      it 'sets current user to nil' do
        expect(session[:current_user_id] && User.find_by(id: session[:current_user_id])).to be_nil
      end

      it 'clears current_user_id from session' do
        expect(session[:current_user_id]).to be_nil
      end

      it 'returns `logout completed` message' do
        expect(response.body).to eq({ message: 'logout completed!' }.to_json)
      end
    end
  end
end
