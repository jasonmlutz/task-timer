Rails.application.routes.draw do
  namespace :api do
    resources :users, only: [:create]
  end
  get "check_availability/:name", to: "users#check_availability", as: :user_name_availability
  
  root 'app#index'
end
