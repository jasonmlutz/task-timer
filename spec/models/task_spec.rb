# == Schema Information
#
# Table name: tasks
#
#  id         :uuid             not null, primary key
#  title      :string           not null
#  user_id    :uuid             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  duration   :integer
#
require 'rails_helper'

RSpec.describe Task, type: :model do
  describe 'Associations' do
    it { should belong_to(:owner).class_name(:User) }
  end

  describe 'Validations' do
    it { should validate_presence_of(:title)}
    it { should validate_presence_of(:user_id)}
  end
end
