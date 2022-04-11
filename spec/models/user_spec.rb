# spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do
  context "Validations" do
    context "Username presence" do
      it "Empty string is invalid" do
        user = User.new(name: "", password: "password")
        expect(user.valid?).to eq(false)
      end
      it "Non-empty string is valid" do
        user = User.new(name: "jason", password: "password")
      expect(user.valid?).to eq(true)
      end
      it "Name must be passed" do
        user = User.new(password: "password")
      expect(user.valid?).to eq(false)
      end
    end
    it "Validates username uniqueness" do
      bob = User.create(name: "bob", password: "password")
      alice = User.new(name: "alice", password: "password")
      bobJr = User.new(name: "bob", password: "passwordJr")
      expect(alice.valid?).to eq(true)
      expect(bobJr.valid?).to eq(false)
    end
  end
end
