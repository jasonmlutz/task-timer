class ApplicationController < ActionController::Base
  helper_method :current_user

  def current_user
    @_current_user ||= session[:current_user_id] && User.find_by(id: session[:current_user_id])
  end
end
