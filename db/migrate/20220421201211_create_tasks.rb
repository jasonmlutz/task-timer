class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks, id: :uuid do |t|
      t.string :title
      t.uuid :user_id, foreign_key: true
      t.time :duration
      t.timestamps
    end
  end
end
