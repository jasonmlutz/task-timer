class AddNotNullToTasks < ActiveRecord::Migration[7.0]
  def change
    change_column_null(:tasks, :title, false)
    change_column_null(:tasks, :user_id, false)
  end
end
