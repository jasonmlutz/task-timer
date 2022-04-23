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
class User < ApplicationRecord
  has_secure_password

  validates :name, presence: true, uniqueness: true

  has_many :tasks, dependent: :destroy

  def expose(*exposed_keys)
    exposed_keys.concat(%w[name id])
    attributes.select { |k, _v| exposed_keys.include?(k) }
  end
end
