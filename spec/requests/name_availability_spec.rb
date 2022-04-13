require 'rails_helper'

RSpec.describe 'Name availability checking', type: :request do
  context 'with available user name' do
    it 'returns name_available: true'
  end

  context 'with unavailable user name' do
    it 'returns name_available: false'
  end
end
