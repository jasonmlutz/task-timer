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
class Task < ApplicationRecord
  validates :title, :user_id, presence: true

  belongs_to :owner, class_name: :User, foreign_key: :user_id, inverse_of: :tasks
end
