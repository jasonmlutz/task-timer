class Api::UsersController < ApplicationController
  wrap_parameters false

  # GET /api/check_availability/:name
  def check_availability
    @user = User.find_by(name: params[:name])
    if @user
      render json: { name_available: false }
    else
      render json: { name_available: true }
    end
  end

  # POST /api/users(.:format)
  def create
    @user = User.find_by(name: params[:name])
    if @user
      render json: { error: 'name not available' }
    else
      @user = User.new(user_params)
      if @user.save
        session[:current_user_id] = @user.id
        render json: @user
      else
        render json: { error: 'object(s) not created' }
      end
    end
  end

  private

  def user_params
    params.permit(:name, :password, :password_confirmation)
  end
end
