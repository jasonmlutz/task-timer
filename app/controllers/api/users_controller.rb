class Api::UsersController < ApplicationController
  before_action :set_user, only: [:show]
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
      if @user.password_confirmation && @user.save
        session[:current_user_id] = @user.id
        render json: @user.expose
      else
        render json: { error: 'object(s) not created' }
      end
    end
  end

  # GET /api/users/:id(.:format)
  def show
    if @user
      render json: @user.expose
    else
      render json: { error: 'record(s) not found' }
    end
  end

  private

  def set_user
    @user = User.find_by(id: params[:id])
  end

  def user_params
    params.permit(:name, :password, :password_confirmation)
  end
end
