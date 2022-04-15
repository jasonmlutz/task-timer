class User < ApplicationRecord
  has_secure_password

  validates :name, presence: true, uniqueness: true

  def expose(*exposedKeys)
    exposedKeys.concat(["name", "id"])
    self.attributes.select { |k, v| exposedKeys.include?(k)}
  end
end
