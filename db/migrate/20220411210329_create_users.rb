class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users, id: :uuid do |t|
      t.string :name, null: false, unique: true
      t.string :password_digest
      t.timestamps
    end
  end
end
