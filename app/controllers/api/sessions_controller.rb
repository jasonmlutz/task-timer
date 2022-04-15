class Api::SessionsController < ApplicationController
  # before_action :set_current_user, only: [:show, :destroy]
  wrap_parameters false

  # GET /api/session
  def show
    if current_user
      render json: current_user.expose
    else
      render json: {}
    end
  end

  # POST /api/session
  def create
    @user = User.find_by(name: params[:name])
    if @user && @user == @user.authenticate(params[:password])
      session[:current_user_id] = @user.id
      render json: current_user.expose
    else
      render json: { error: 'name and/or password incorrect' }
    end
  end

  # DELETE /api/session
  def destroy
    if current_user
      session.delete(:current_user_id)
      current_user = nil
      render json: { message: 'logout completed!' }
    else
      render json: { message: 'no user to logout!' }
    end
  end
end
