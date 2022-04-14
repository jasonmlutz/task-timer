Rails.application.routes.draw do
  namespace :api do
    resources :users, only: [:create]
    get 'check_availability/:name', to: 'users#check_availability', as: :user_name_availability
    resource :session, only: %i[create show destroy]
  end

  root 'app#index'

  get '*path', to: 'app#index'
end
